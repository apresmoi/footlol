import Player from "./collideables/player"
import { RoomStage, IChatMessage, ResetType, TeamSide } from "../types"
import { Field } from "./field"
import { ChampionName } from "../league/classes"
import { objectToBinary, binaryToObject } from '../utilities/conversion'

export class Room extends Field {
    _socket: SocketIO.Namespace
    _stage: RoomStage = 'TEAM_SELECT'

    constructor(id: string, name: string, socket: SocketIO.Namespace) {
        super(id, name);
        this._handleSocket(socket)
        this._socket = socket;
    }

    allPlayersDisconnected: () => void = null

    _handleSocket(socket: SocketIO.Namespace) {
        const self = this
        socket.on('connection', function (socket) {
            const playerId = socket.id

            console.log(playerId + ' connected');

            const { name } = socket.handshake.query

            if (self.addPlayer(playerId, name, null)) {
                socket.emit('login_success', objectToBinary({ self: self._players[playerId].serialize(), ...self.serialize(), }));
                socket.broadcast.emit('player_join', objectToBinary(self._players[playerId].serialize()));

                socket.on('request_direction_change', function (binary) {
                    const payload = binaryToObject(binary)
                    self.playerDirectionChanged(playerId, payload.direction)
                });
                socket.on('request_key_press', function (binary) {
                    const payload = binaryToObject(binary)
                    self.playerKeyPress(playerId, payload.code).then(kick => {
                        if (kick) socket.emit('ball_kicked', { kicked: true })
                    })
                });
            } else {
                socket.emit('login_success', objectToBinary({ self: null, ...self.serialize(), }));
            }

            socket.on('disconnect', function (ff) {
                console.log(playerId + ' disconnected');
                const isAdmin = self._players[playerId] && self._players[playerId]._admin
                self.removePlayer(playerId);
                socket.broadcast.emit('player_leave', objectToBinary({ id: playerId }))

                if (self._connectedPlayers().length === 0) {
                    self._reset('RESET')
                    if (self.allPlayersDisconnected) self.allPlayersDisconnected()
                } else {
                    self._players[Object.keys(self._players)[0]]._admin = true
                    self._emit()
                }
            });
            socket.on('request_send_message', function (binary) {
                const payload = binaryToObject(binary)
                self.playerSendMessage(socket, payload.message)
            });
            socket.on('request_player_ready', function (binary) {
                const payload = binaryToObject(binary)
                self.playerReady(socket, payload.ready)
                self._emit()
            });
            socket.on('request_champion_select', (binary) => {
                const payload = binaryToObject(binary)
                self.tryChangeChampion(socket, payload.champion)
                self._emit()
            })
            socket.on('request_kick_player', (binary) => {
                const payload = binaryToObject(binary)
                self.tryKickPlayer(socket, payload.id)
            })
            socket.on('request_change_side', (binary) => {
                const payload = binaryToObject(binary)
                self.tryChangeSide(socket, payload.side)
                self._emit()
            })
        });
    }

    onGoal = (side: TeamSide, player: Player) => {
        this._socket.emit('goal', objectToBinary({ side, player: player._name }))
    }

    _emit = () => {
        this._socket.emit('update', objectToBinary(this.serialize()));
    }

    _endGame() {
        super._endGame()
        setTimeout(() => {
            this._tryStageChange()
        }, this.__leave_countdown * 1000);
    }

    _reset(type: ResetType) {
        super._reset(type)
        if (type === 'RESET') {
            const players = this._connectedPlayers()
            this._stage = 'TEAM_SELECT'
            this._socket.emit('stage_change', objectToBinary({ stage: this._stage }))
            players.forEach(x => x.setReady(false))
        }
    }

    _tryStageChange = () => {
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
                this._socket.emit('stage_change', objectToBinary({ stage: this._stage }))
                this._socket.emit('message_sent', objectToBinary({ name: "GameServer", message: "HOW TO PLAY:" }));
                this._socket.emit('message_sent', objectToBinary({ name: "GameServer", message: "MOVE WITH ARROW KEYS" }));
                this._socket.emit('message_sent', objectToBinary({ name: "GameServer", message: "KICK THE BALL WITH SPACE" }));
                this._socket.emit('message_sent', objectToBinary({ name: "GameServer", message: "Q AND W FOR THE SKILLS" }));
                players.forEach(x => x.setReady(false))
                this._startGame()
            }
        }
        else if (this._stage === 'FIELD' && this._gameEnded) {
            const players = this._connectedPlayers()
            this._stage = 'TEAM_SELECT'
            this._socket.emit('stage_change', objectToBinary({ stage: this._stage }))
            players.forEach(x => x.setReady(false))
        }
    }

    addPlayer(id: string, name: string, champion: ChampionName): boolean {
        if (['TEAM_SELECT'].includes(this._stage) && this._connectedPlayers().length < 10)
            return super.addPlayer(id, name, champion)
        return false
    }

    playerSendMessage(client: SocketIO.Socket, { message }: { message: string }) {
        const player = this._players[client.id]
        this._socket.emit('message_sent', objectToBinary({ name: player._name, message }));
    }

    playerReady(client: SocketIO.Socket, ready: boolean) {
        const player = this._players[client.id]
        if (player && this._stage === "TEAM_SELECT" || (player._champion && this._stage === "CHAMPION_SELECT")) {
            player.setReady(ready)
            this._tryStageChange()
        }
    }

    tryChangeChampion(client: SocketIO.Socket, champion: ChampionName) {
        if (!this._connectedPlayers().some(x => x._champion?.name === champion)) {
            const player = this._players[client.id]
            player.setChampion(champion)
        }
    }

    tryKickPlayer(client: SocketIO.Socket, id: string) {
        const admin = this._players[client.id]
        if (admin && admin._admin && this._connectedPlayers().find(x => x._id === id)) {
            this.removePlayer(id)
            this._socket.to(id).emit('player_kicked', objectToBinary({ kicked: true }))
        }
    }

    tryChangeSide(client: SocketIO.Socket, side: TeamSide) {
        this.playerChangeSide(client.id, side)
    }

    _connectedPlayers(): Player[] {
        return Object.keys(this._players).reduce((r, key) => {
            //@ts-ignore
            if (this._socket.clients().connected[key])
                r.push(this._players[key])
            else
                delete this._players[key]
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
            ball: this._ball._mounted ? this._ball.serialize() : null,
            score: this._score ? this._score.serialize() : null,
            time: this.__seconds_limit - seconds,
            countdown: this.__countdown > seconds ? this.__countdown - seconds : 0,
            victory: this._gameEnded === true ? this._victorySide : null,
            effects: this._serializeEffects(),
            debug: this._getAllObjects()
        }
    }
}