import Player from "./collideables/player"
import Ball from "./collideables/ball"
import { Vector } from "./math"
import { Champion, ChampionName } from "../league/classes"
import { time, mapSize } from "../globals"
import { Engine, World } from 'matter-js'
import { RectCollideable, PolygonCollideable } from "./collideables/physics"


const positions = [
    [[200, 415]],
    [[1700, 415]]
]

export class Room {
    _id: string
    _players: { [x: string]: Player }
    _ball: Ball
    _socket: SocketIO.Server
    _interval: NodeJS.Timeout
    _engine: Engine
    _world: World

    constructor(id: string, socket: SocketIO.Server) {
        this._engine = Engine.create();
        this._world = this._engine.world;
        this._world.bounds = mapSize;
        this._world.gravity.x = 0;
        this._world.gravity.y = 0;

        this._id = id;
        this._socket = socket;

        this._players = {};
        this._ball = new Ball(mapSize.center);

        this._ball.materialize(this._world);

        const ground0 = new RectCollideable(0, new Vector(mapSize.center.x, -50), mapSize.max.x, 100, null, { isStatic: true })
        const ground1 = new RectCollideable(0, new Vector(mapSize.center.x, mapSize.max.y + 50), mapSize.max.x, 100, null, { isStatic: true })
        const ground2 = new RectCollideable(0, new Vector(-50, mapSize.center.y), 100, mapSize.max.y, null, { isStatic: true })
        const ground3 = new RectCollideable(0, new Vector(mapSize.max.x + 50, mapSize.center.y), 100, mapSize.max.y, null, { isStatic: true })
        ground0.materialize(this._world);
        ground1.materialize(this._world);
        ground2.materialize(this._world);
        ground3.materialize(this._world);

        this._interval = setInterval(() => {
            if (this.update())
                this._socket.emit('update', this.serialize());
        }, time)
    }

    addPlayer(client: SocketIO.Socket, name: string, champion: ChampionName) {
        const { id } = client
        const players = this._connectedPlayers()
        const side = players.length % 2 ? 0 : 1
        const [x, y] = positions[side][0]
        this._players[id] = new Player(id, name, champion, new Vector(x, y));

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
        }
    }
}