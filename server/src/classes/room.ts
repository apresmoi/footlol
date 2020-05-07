import Player from "./collideables/player"
import Ball from "./collideables/ball"
import { Vector } from "./math"
import { Champion, ChampionName } from "../league/classes"
import { timeResolution, mapSize } from "../globals"


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

    constructor(id: string, socket: SocketIO.Server) {
        this._id = id;
        this._socket = socket;

        this._players = {};
        this._ball = new Ball(new Vector(mapSize._width / 2, mapSize._height / 2));
        this._interval = setInterval(() => {
            if (this._evolve(timeResolution)) {
                this._socket.emit('update', this.serialize());
            }
        }, timeResolution * 1000)
    }

    addPlayer(client: SocketIO.Socket, name: string, champion: ChampionName) {
        const { id } = client
        const players = this._connectedPlayers()
        const side = players.length % 2 ? 0 : 1
        const [x, y] = positions[side][0]
        this._players[id] = new Player(id, name, champion, new Vector(x, y));


        client.emit('login_success', {
            ...this._players[id].serialize(),
            ...this.serialize(),
        });
        client.broadcast.emit('player_join', this._players[id].serialize());
    }

    removePlayer(client: SocketIO.Socket) {
        const { id } = client
        this._players = Object.keys(this._players).reduce((result, key) => {
            if (key !== id) result[key] = this._players[key]
            return result
        }, {})
        client.broadcast.emit('player_leave', { id })
    }

    playerDirectionChanged(client: SocketIO.Socket, { x, y }: { x: number, y: number }) {
        const { id } = client
        if (this._players[id]) {
            this._players[id].applyImpulse(new Vector(x, y), timeResolution);
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

    _evolve(dt: number) {
        let changed = false;
        this._connectedPlayers().forEach(player => {
            changed = changed || player.evolve(dt);
        })
        return changed
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