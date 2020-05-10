import Player from "./collideables/player"
import Ball, { BallCategory, Kicker } from "./collideables/ball"
import { Vector } from "./math"
import { ChampionName } from "../league/classes"
import { time, mapSize, mapInnerSize, goalSize, playerPositions } from "../globals"
import { Engine, World, Events, Body } from 'matter-js'
import { RectCollideable, Collideable, CircleCollideable } from "./collideables/physics"
import Wall from "./collideables/wall"
import Goal from "./collideables/goal"
import { TeamSide, RoomSensors, ResetType, ICollideableEventCollision } from "../types"
import TurnWall from "./collideables/turnwall"
import { Score } from "./score"

export class Room {
    _id: string
    _players: { [x: string]: Player }
    _ball: Ball
    _socket: SocketIO.Server
    _interval: NodeJS.Timeout
    _engine: Engine
    _world: World
    _score: Score
    _startTime: Date


    _goal: boolean = false
    _sideTurn: TeamSide = 'LEFT' // this is the side that will start with control of the ball


    _walls: RectCollideable[] = [
        new Wall(new Vector(0, -100), mapSize.width, 100),
        new Wall(new Vector(0, mapSize.max.y), mapSize.width, 100),
        new Wall(new Vector(-100, 0), 100, mapSize.max.y),
        new Wall(new Vector(mapSize.max.x, 0), 100, mapSize.max.y),


        new Wall(new Vector(0, -100 + (mapSize.height - mapInnerSize.height) / 2), mapSize.width, 100, { collisionFilter: { mask: BallCategory } }),
        new Wall(new Vector(0, mapSize.max.y - (mapSize.height - mapInnerSize.height) / 2), mapSize.width, 100, { collisionFilter: { mask: BallCategory } }),

        new Wall(new Vector(-100 + (mapSize.width - mapInnerSize.width) / 2, 0), 100, (mapSize.height - goalSize.height) / 2, { collisionFilter: { mask: BallCategory } }),
        new Wall(new Vector(-100 + (mapSize.width - mapInnerSize.width) / 2, (mapSize.height + goalSize.height) / 2), 100, (mapSize.height - goalSize.height) / 2, { collisionFilter: { mask: BallCategory } }),

        new Wall(new Vector(mapSize.max.x - (mapSize.width - mapInnerSize.width) / 2, 0), 100, (mapSize.height - goalSize.height) / 2, { collisionFilter: { mask: BallCategory } }),
        new Wall(new Vector(mapSize.max.x - (mapSize.width - mapInnerSize.width) / 2, (mapSize.height + goalSize.height) / 2), 100, (mapSize.height - goalSize.height) / 2, { collisionFilter: { mask: BallCategory } }),
    ]

    _startWalls: { [side in TeamSide]: Collideable } = {
        'LEFT': new TurnWall('LEFT'),
        'RIGHT': new TurnWall('RIGHT')
    }

    _sensors: { [key in RoomSensors]: Goal } = {
        LEFT_GOAL: new Goal(mapSize.center.setX(0), 'LEFT'),
        RIGHT_GOAL: new Goal(new Vector(mapSize.max.x - (mapSize.width - mapInnerSize.width) / 2, mapSize.center.y), 'RIGHT')
    }

    constructor(id: string, socket: SocketIO.Server) {
        this._engine = Engine.create();

        Events.on(this._engine, 'collisionStart', this._handleCollisionsStart);

        Events.on(this._engine, 'collisionEnd', this._handleCollisionsEnd);

        this._world = this._engine.world;
        this._world.bounds = mapSize;
        this._world.gravity.x = 0;
        this._world.gravity.y = 0;

        this._id = id;
        this._socket = socket;
        this._score = new Score()

        this._players = {};
        this._mountWalls()
        this._mountSensors()

        this._start()
    }

    __seconds_limit = 600
    __seconds = 0

    _emit = () => {
        this._socket.emit('update', this.serialize());

    }

    _start = () => {
        this._startTime = new Date();
        this._mountBall();
        this._mountStartWalls();
        this._interval = setInterval(() => {
            if (this.update() || this.__seconds !== this.getSeconds()) {
                this.__seconds = this.getSeconds()
                if (this.__seconds_limit - this.__seconds <= 0)
                    this._reset('RESET')
                else
                    this._emit()
            }
        }, time)
    }

    _reset = (type: ResetType) => {
        if (type === 'GOAL') {
            setTimeout(() => {
                this._goal = false
                this._ball.dematerialize(this._world);
                this._mountBall()
                this._mountStartWalls()
                this._connectedPlayers().forEach(player => player.resetPosition(this._world))
                this._emit()
            }, 2900);
        } else if (type === 'RESET') {
            this.__seconds = 0;
            this._startTime = new Date();
            this._goal = false;
            this._sideTurn = 'LEFT'
            this._ball.dematerialize(this._world)
            this._score.reset()
            this._mountBall()
            this._mountStartWalls()
            this._connectedPlayers().forEach(player => player.resetPosition(this._world))
            this._emit()
        }
    }

    _mountBall = () => {
        this._ball = new Ball(mapSize.center);
        this._ball.materialize(this._world);
    }

    _mountWalls = () => {
        this._walls.forEach(wall => wall.materialize(this._world))
    }

    _mountStartWalls = () => {
        switch (this._score.lastGoalSide()) {
            case 'LEFT':
                this._sideTurn = 'RIGHT'
                break;
            case 'RIGHT':
                this._sideTurn = 'LEFT'
                break;
            default:
                break;
        }
        this._startWalls[this._sideTurn].materialize(this._world)
    }

    _unmountStartWalls = () => {
        this._startWalls['LEFT'].dematerialize(this._world)
        this._startWalls['RIGHT'].dematerialize(this._world)
    }

    _mountSensors = () => {
        Object.keys(this._sensors).forEach(key => this._sensors[key] ? this._sensors[key].materialize(this._world) : null)
    }

    addPlayer(client: SocketIO.Socket, name: string, champion: ChampionName) {
        const { id } = client
        const players = this._connectedPlayers()
        const side: TeamSide = players.length % 2 ? 'LEFT' : 'RIGHT'

        if (players.length < 10) {
            this._players[id] = new Player(id, name, champion, playerPositions[side][players.filter(x => x._side === side).length], side);

            this._players[id].materialize(this._world);

            client.emit('login_success', {
                ...this._players[id].serialize(),
                ...this.serialize(),
            });
            client.broadcast.emit('player_join', this._players[id].serialize());
        }
    }

    removePlayer(client: SocketIO.Socket) {
        const { id } = client
        if (this._players[id]) {
            this._players[id].dematerialize(this._world);
        }
        this._players = Object.keys(this._players).reduce((result, key) => {
            if (key !== id) result[key] = this._players[key]
            return result
        }, {})
        client.broadcast.emit('player_leave', { id })
    }

    playerDirectionChanged(client: SocketIO.Socket, { x, y }: { x: number, y: number }) {
        const { id } = client
        if (this._players[id]) {
            this._players[id].changeDirection(new Vector(x, y));
        }
    }

    playerKeyPress(client: SocketIO.Socket, code: string) {
        const { id } = client
        switch (code) {
            case 'Space':
                this._players[id].kick(this._ball)
                break;
            case 'KeyQ':
                this._players[id].requestAbility('Q')
                break
            case 'KeyW':
                this._players[id].requestAbility('W')
                break
            default:
                break;
        }
    }

    _connectedPlayers(): Player[] {
        return Object.keys(this._players).reduce((r, key) => {
            if (this._socket.clients().connected[key])
                r.push(this._players[key])
            return r;
        }, [])
    }

    _handleBallInsideGoal(sensor: Goal): void {
        if (this._goal) return // this avoids double goal in one turn

        const lastKicker = this._ball.getLastKicker()
        if (this._sensors.LEFT_GOAL === sensor) {
            //if the ball gets inside the Left side, the goal is for the right team
            this._goal = true
            this._score.addGoal('RIGHT', lastKicker.player, this.__seconds)
            this._reset('GOAL')
        } else if (this._sensors.RIGHT_GOAL === sensor) {
            //if the ball gets inside the right side,  the goal is for the left team
            this._goal = true
            this._score.addGoal('LEFT', lastKicker.player, this.__seconds)
            this._reset('GOAL')
        }
    }

    _handlePlayerBallProximity(player: Player, closeToBall: boolean): void {
        player.allowPlayerToKick(closeToBall)
    }

    _handleCollisionsStart = (e: ICollideableEventCollision): void => {
        let pairs = e.pairs;

        for (let i = 0, j = pairs.length; i != j; ++i) {
            const pair = pairs[i];

            //Ball collides with Goals
            // A | B is ball
            // A | B is Goal SENSOR
            if (pair.bodyA.isSensor && pair.bodyA.plugin instanceof Goal && pair.bodyB === this._ball._body) {
                this._handleBallInsideGoal(pair.bodyA.plugin)
                continue;
            }
            else if (pair.bodyB.isSensor && pair.bodyB.plugin instanceof Goal && pair.bodyA === this._ball._body) {
                this._handleBallInsideGoal(pair.bodyB.plugin)
                continue;
            }

            //Player physical body collides with Ball
            // A | B is ball
            // A | B is physical part of player
            if (!pair.bodyA.isSensor && pair.bodyA.plugin instanceof Player && pair.bodyB.plugin === this._ball) {
                this._ball.addKicker(this.__seconds, pair.bodyA.plugin)
                continue;
            }
            else if (!pair.bodyB.isSensor && pair.bodyB.plugin instanceof Player && pair.bodyA.plugin === this._ball) {
                this._ball.addKicker(this.__seconds, pair.bodyB.plugin)
                continue;
            }

            //Player sensor portion is overlaping with Ball
            // A | B is ball
            // A | B is SENSOR part of player
            if (pair.bodyA.isSensor && pair.bodyA.plugin instanceof Player && pair.bodyB.plugin === this._ball) {
                // this._handleScore(pair.bodyA, this._ball.getLastKicker())
                this._handlePlayerBallProximity(pair.bodyA.plugin, true)
                continue;
            }
            else if (pair.bodyB.isSensor && pair.bodyB.plugin instanceof Player && pair.bodyA.plugin === this._ball) {
                // this._handleScore(pair.bodyB, this._ball.getLastKicker())
                this._handlePlayerBallProximity(pair.bodyB.plugin, true)
                continue;
            }

        }
    }

    _handleCollisionsEnd = (e: ICollideableEventCollision): void => {
        const pairs = e.pairs;

        for (let i = 0, j = pairs.length; i != j; ++i) {
            const pair = pairs[i];

            //Player sensor portion is overlaping with Ball
            // A | B is ball
            // A | B is SENSOR part of player
            if (pair.bodyA.isSensor && pair.bodyA.plugin instanceof Player && pair.bodyB.plugin === this._ball) {
                this._handlePlayerBallProximity(pair.bodyA.plugin, false)
                continue;
            }
            else if (pair.bodyB.isSensor && pair.bodyB.plugin instanceof Player && pair.bodyA.plugin === this._ball) {
                this._handlePlayerBallProximity(pair.bodyB.plugin, false)
                continue;
            }
        }
    }

    update(): boolean {
        Engine.update(this._engine);

        this._connectedPlayers().forEach(player => player.update());
        this._ball.update();
        if (this._ball._body.speed > 0) this._unmountStartWalls()

        return this._world.bodies.some(x => x.speed > 0)
    }

    getSeconds(): number {
        return Math.trunc((new Date().getTime() - this._startTime.getTime()) / 1000)
    }

    serialize() {
        return {
            players: Object.keys(this._players).reduce((r, key) => {
                if (this._socket.clients().connected[key])
                    r[key] = this._players[key].serialize()
                return r;
            }, {}),
            ball: this._ball.serialize(),
            score: this._score.serialize(),
            time: this.__seconds_limit - this.getSeconds()
        }
    }
}