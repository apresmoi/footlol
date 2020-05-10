import Player from "./collideables/player"
import Ball, { BallCategory, Kicker } from "./collideables/ball"
import { Vector } from "./math"
import { ChampionName } from "../league/classes"
import { time, mapSize, mapInnerSize, goalSize, playerPositions } from "../globals"
import { Engine, World, Events, Body } from 'matter-js'
import { RectCollideable, Collideable, CircleCollideable } from "./collideables/physics"
import Wall from "./collideables/wall"
import Goal from "./collideables/goal"
import { RoomSide, RoomSensors, RoomScore, ResetType } from "../types"
import TurnWall from "./collideables/turnwall"

export class Room {
    _id: string
    _players: { [x: string]: Player }
    _ball: Ball
    _socket: SocketIO.Server
    _interval: NodeJS.Timeout
    _engine: Engine
    _world: World
    _score: RoomScore = { left: 0, right: 0, goals: [] }
    _startTime: Date


    _goal: boolean = false
    _sideTurn: RoomSide = 'RIGHT'


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

    _startWalls: { [side in RoomSide]: Collideable } = {
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

        this._players = {};
        this._mountWalls()
        this._mountSensors()

        this._start()
    }

    __seconds_limit = 10
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
        if (this._score.goals.length)
            switch (this._score.goals[this._score.goals.length - 1].side) {
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
        this._startWalls[this._sideTurn].dematerialize(this._world)
    }

    _mountSensors = () => {
        Object.keys(this._sensors).forEach(key => this._sensors[key] ? this._sensors[key].materialize(this._world) : null)
    }

    addPlayer(client: SocketIO.Socket, name: string, champion: ChampionName) {
        const { id } = client
        const players = this._connectedPlayers()
        const side: RoomSide = players.length % 2 ? 'LEFT' : 'RIGHT'

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

    _handleScore(sensor: Body, kicker: Kicker): void {
        if (this._sensors.LEFT_GOAL.checkSensor(sensor) && !this._goal) {
            this._score = {
                left: this._score.left + 1,
                right: this._score.right,
                goals: [
                    ...this._score.goals,
                    {
                        playerId: kicker.playerId,
                        seconds: this.__seconds,
                        side: 'RIGHT'
                    }
                ]
            }
            this._goal = true
            this._reset('GOAL')
        } else if (this._sensors.RIGHT_GOAL.checkSensor(sensor) && !this._goal) {
            this._score = {
                left: this._score.left,
                right: this._score.right + 1,
                goals: [
                    ...this._score.goals,
                    {
                        playerId: kicker.playerId,
                        seconds: this.__seconds,
                        side: 'LEFT'
                    }
                ]
            }
            this._goal = true
            this._reset('GOAL')
        }
    }

    _handleProximity(sensor: Body, closeToBall: boolean): void {
        this._connectedPlayers().forEach(player => {
            if (player.checkSensor(sensor)) {
                player.canKick(closeToBall)
            }
        })
    }

    _handleCollisionsStart = (e: Matter.IEventCollision<Engine>): void => {
        let pairs = e.pairs;

        for (let i = 0, j = pairs.length; i != j; ++i) {
            const pair = pairs[i];

            if (!pair.bodyA.isSensor && pair.bodyB === this._ball._body) {
                this._connectedPlayers().forEach(player => {
                    if (player._body.id === pair.bodyA.id || player._body.id === pair.bodyA?.parent.id) {
                        this._ball.addKicker(this.__seconds, player)
                    }
                })
            } else if (!pair.bodyB.isSensor && pair.bodyA === this._ball._body) {
                this._connectedPlayers().forEach(player => {
                    if (player._body.id === pair.bodyB.id || player._body.id === pair.bodyB?.parent.id) {
                        this._ball.addKicker(this.__seconds, player)
                    }
                })
            }

            if (pair.bodyA.isSensor && pair.bodyB === this._ball._body) {
                this._handleScore(pair.bodyA, this._ball.getLastKicker())
                this._handleProximity(pair.bodyA, true)
            }
            else if (pair.bodyA === this._ball._body && pair.bodyB.isSensor) {
                this._handleScore(pair.bodyB, this._ball.getLastKicker())
                this._handleProximity(pair.bodyB, true)
            }
        }
    }

    _handleCollisionsEnd = (e: Matter.IEventCollision<Engine>): void => {
        const pairs = e.pairs;

        for (let i = 0, j = pairs.length; i != j; ++i) {
            const pair = pairs[i];

            if (pair.bodyA.isSensor && pair.bodyB === this._ball._body) {
                this._handleProximity(pair.bodyA, false)
            }
            else if (pair.bodyA === this._ball._body && pair.bodyB.isSensor) {
                this._handleProximity(pair.bodyB, false)
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
            score: this._score,
            time: this.__seconds_limit - this.getSeconds()
        }
    }
}