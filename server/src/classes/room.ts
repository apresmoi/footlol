import Player from "./collideables/player"
import Ball, { BallCategory } from "./collideables/ball"
import { Vector } from "./math"
import { ChampionName } from "../league/classes"
import { time, mapSize, mapInnerSize, goalSize } from "../globals"
import { Engine, World, Events, Body } from 'matter-js'
import { RectCollideable } from "./collideables/physics"
import Wall, { WallCategory } from "./collideables/wall"
import Goal from "./collideables/goal"

export type RoomSide = 'LEFT' | 'RIGHT'
type RoomSensors = 'LEFT_GOAL' | 'RIGHT_GOAL'
type RoomScore = { left: number, right: number }

const positions: { [side in RoomSide]: Vector[] } = {
    'LEFT': [new Vector(mapSize.center.x - 300, mapSize.center.y)],
    'RIGHT': [new Vector(mapSize.center.x + 300, mapSize.center.y)]
}



export class Room {
    _id: string
    _players: { [x: string]: Player }
    _ball: Ball
    _socket: SocketIO.Server
    _interval: NodeJS.Timeout
    _engine: Engine
    _world: World
    _score: RoomScore = { left: 0, right: 0 }

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
        this._ball = new Ball(mapSize.center);
        this._ball.materialize(this._world);
        this._mountWalls()
        this._mountSensors()

        this._interval = setInterval(() => {
            if (this.update())
                this._socket.emit('update', this.serialize());
        }, time)
    }

    _mountWalls = () => {
        this._walls.forEach(wall => wall.materialize(this._world))
    }

    _mountSensors = () => {
        Object.keys(this._sensors).forEach(key => this._sensors[key] ? this._sensors[key].materialize(this._world) : null)
    }

    addPlayer(client: SocketIO.Socket, name: string, champion: ChampionName) {
        const { id } = client
        const players = this._connectedPlayers()
        const side: RoomSide = players.length % 2 ? 'LEFT' : 'RIGHT'
        this._players[id] = new Player(id, name, champion, positions[side][0], side);

        this._players[id].materialize(this._world);

        client.emit('login_success', {
            ...this._players[id].serialize(),
            ...this.serialize(),
        });
        client.broadcast.emit('player_join', this._players[id].serialize());
    }

    removePlayer(client: SocketIO.Socket) {
        const { id } = client
        this._players[id].dematerialize(this._world);
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
        // switch (code) {
        //     case 'Space':
        //         if (this.players[id].isTouchingBall(this.ball.position)) {
        //             this.ball.shootBall(this.players[id])
        //         }
        //         break;
        //     default:
        //         this.players[id].keyPress(code)
        //         break;
        // }
    }

    _connectedPlayers(): Player[] {
        return Object.keys(this._players).reduce((r, key) => {
            if (this._socket.clients().connected[key])
                r.push(this._players[key])
            return r;
        }, [])
    }


    _updateScore(sensor: Body): void {
        if (this._sensors.LEFT_GOAL.checkSensor(sensor)) {
            this._score = {
                left: this._score.left + 1,
                right: this._score.right,
            }
            setTimeout(() => {
                this._ball.reset();
            }, 1000);
        } else if (this._sensors.RIGHT_GOAL.checkSensor(sensor)) {
            this._score = {
                left: this._score.left,
                right: this._score.right + 1,
            }
            setTimeout(() => {
                this._ball.reset();
            }, 1000);
        }
    }

    _handleCollisionsStart = (e: Matter.IEventCollision<Engine>): void => {
        let pairs = e.pairs;

        for (let i = 0, j = pairs.length; i != j; ++i) {
            const pair = pairs[i];

            if (pair.bodyA.isSensor && pair.bodyB === this._ball._body) {
                this._updateScore(pair.bodyA)
            }
            else if (pair.bodyA === this._ball._body && pair.bodyB.isSensor) {
                this._updateScore(pair.bodyB)
            }
        }
    }

    _handleCollisionsEnd = (e: Matter.IEventCollision<Engine>): void => {
        const pairs = e.pairs;
        // for (let i = 0, j = pairs.length; i != j; ++i) {
        //     const pair = pairs[i];
        // }
    }

    update(): boolean {
        Engine.update(this._engine);

        this._connectedPlayers().forEach(player => player.update());
        this._ball.update();

        return this._world.bodies.some(x => x.speed > 0)
    }

    serialize() {
        return {
            players: Object.keys(this._players).reduce((r, key) => {
                if (this._socket.clients().connected[key])
                    r[key] = this._players[key].serialize()
                return r;
            }, {}),
            ball: this._ball.serialize(),
            score: this._score
        }
    }
}