import Player from "./collideables/player"
import { RoomStage, IChatMessage } from "../types"
import { Field } from "./field"
import { ChampionName } from "../league/classes"

export class Room extends Field {
    _socket: SocketIO.Namespace
    _messages: IChatMessage[]
    _stage: RoomStage = 'TEAM_SELECT'

    constructor(id: string, name: string, socket: SocketIO.Namespace) {
        super(id, name);
        this._handleSocket(socket)
        this._socket = socket;
    }

    _handleSocket(socket: SocketIO.Namespace) {
        const self = this
        socket.on('connection', function (socket) {
            const playerId = socket.id

            console.log(playerId + ' connected');

            const { name } = socket.handshake.query

            if (self.addPlayer(playerId, name, null)) {
                socket.emit('login_success', { self: self._players[playerId].serialize(), ...self.serialize(), });
                socket.broadcast.emit('player_join', self._players[playerId].serialize());

                socket.on('request_direction_change', function (payload) {
                    self.playerDirectionChanged(playerId, payload.direction)
                });
                socket.on('request_key_press', function (payload) {
                    self.playerKeyPress(playerId, payload.code)
                });
            }

            socket.on('disconnect', function (ff) {
                console.log(playerId + ' disconnected');
                self.removePlayer(playerId);
                socket.broadcast.emit('player_leave', { id: playerId })
                if (self._connectedPlayers().length === 0) {
                    self._endGame()
                }
            });
            socket.on('request_send_message', function (payload) {
                self.playerSendMessage(socket, payload.message)
            });
            socket.on('request_player_ready', function (payload) {
                self.playerReady(socket, payload.ready)
                self._emit()
            });
            socket.on('request_champion_select', (payload) => {
                self.tryChangeChampion(socket, payload.champion)
                self._emit()
            })
        });
    }

    _emit = () => {
        this._socket.emit('update', this.serialize());
    }

    _endGame() {
        super._endGame()
        setTimeout(() => {
            this._tryStageChange()
        }, this.__leave_countdown * 1000);
    }

    _tryStageChange = () => {
        console.log('_tryStageChange', this._gameEnded)
        if (this._stage === 'TEAM_SELECT') {
            const players = this._connectedPlayers()
            if (players.length && !players.some(x => !x.isReady())) {
                this._resetPlayers()
                this._stage = 'CHAMPION_SELECT'
                players.forEach(x => x.setReady(false))
                this._emit()
            }
        }
        else if (this._stage === 'CHAMPION_SELECT') {
            const players = this._connectedPlayers()
            if (!players.some(x => !x.isReady())) {
                this._stage = 'FIELD'
                this._socket.emit('stage_change', { stage: this._stage })
                players.forEach(x => x.setReady(false))
                this._startGame()
            }
        }
        else if (this._stage === 'FIELD' && this._gameEnded) {
            const players = this._connectedPlayers()
            this._stage = 'TEAM_SELECT'
            this._socket.emit('stage_change', { stage: this._stage })
            players.forEach(x => x.setReady(false))
        }
    }

    addPlayer(id: string, name: string, champion: ChampionName): boolean {
        if (['CHAMPION_SELECT', 'TEAM_SELECT'].includes(this._stage))
            return super.addPlayer(id, name, champion)
        return false
    }

    playerSendMessage(client: SocketIO.Socket, { message }: { message: string }) {
        const player = this._players[client.id]
        this._messages.push({
            player,
            message,
            date: new Date()
        })
        client.broadcast.emit('message_sent', { name: player._name, message });
    }

    playerReady(client: SocketIO.Socket, ready: boolean) {
        const player = this._players[client.id]
        player.setReady(ready)
        this._tryStageChange()
    }

    tryChangeChampion(client: SocketIO.Socket, champion: ChampionName) {
        if (!this._connectedPlayers().some(x => x._champion?.name === champion)) {
            const player = this._players[client.id]
            player.setChampion(champion)
        }
    }

    _connectedPlayers(): Player[] {
        return Object.keys(this._players).reduce((r, key) => {
            //@ts-ignore
            if (this._socket.clients().connected[key])
                r.push(this._players[key])
            return r;
        }, [])
    }


    serialize() {
        const seconds = this.getSeconds()
        return {
            stage: this._stage,
            players: Object.keys(this._players).reduce((r, key) => {
                //@ts-ignore
                if (this._socket.clients().connected[key])
                    r[key] = this._players[key].serialize()
                return r;
            }, {}),
            ball: this._ball ? this._ball.serialize() : null,
            score: this._score ? this._score.serialize() : null,
            time: this.__seconds_limit - seconds,
            countdown: this.__countdown > seconds ? this.__countdown - seconds : 0,
            victory: this._gameEnded === true ? this._victorySide : null
        }
    }
}