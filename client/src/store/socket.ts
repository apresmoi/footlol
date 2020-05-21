import { Player, PlayerMessage, MessageSubscribers, UpdatePayload, Vector, GoalPayload, PlayerReadyPayload, StageChangePayload, LoginSuccessPayload } from "./types"
import io from 'socket.io-client';
import { objectToBinary, binaryToObject } from '../utils/conversion'
import { playSound } from './sounds'

const REQUEST_DIRECTION_CHANGE = 'request_direction_change'
const REQUEST_KEY_PRESS = 'request_key_press'
const REQUEST_SEND_MESSAGE = 'request_send_message'
const REQUEST_PLAYER_READY = 'request_player_ready'
const REQUEST_CHAMPION_SELECT = 'request_champion_select'
const REQUEST_KICK_PLAYER = 'request_kick_player'
const REQUEST_CHANGE_SIDE = 'request_change_side'

const LOGIN_SUCCESS = 'login_success'
const PLAYER_JOIN = 'player_join'
const PLAYER_LEAVE = 'player_leave'
const PLAYER_READY = 'player_ready'
const POSITION_CHANGE = 'position_change'
const MESSAGE_SENT = 'message_sent'
const STAGE_CHANGE = 'stage_change'
const PLAYER_KICKED = 'player_kicked'
const UPDATE = 'update'

//effects
const BALL_KICKED = 'ball_kicked'
const GOAL = 'goal'


class RoomSocket {
    _chatSocket: SocketIOClient.Socket
    _onMessageSubscribers: MessageSubscribers = {}

    constructor(roomId, name) {
        this._chatSocket = io(window.location.protocol + '//' + window.location.host.replace(':8000', '') + ':8081' + `${roomId}?name=${name}`, {
            path: `/ws`,
            autoConnect: false,
        });

        this._chatSocket.on(LOGIN_SUCCESS, (binary) => {
            const payload: LoginSuccessPayload = binaryToObject(binary)
            // console.log('login_success', payload)
            if (this._onMessageSubscribers.login_success) this._onMessageSubscribers.login_success(payload)
        });

        this._chatSocket.on(PLAYER_JOIN, (binary) => {
            playSound(PLAYER_JOIN)
            const payload: Player = binaryToObject(binary)
            // console.log('player_join', payload)
            if (this._onMessageSubscribers.player_join) this._onMessageSubscribers.player_join(payload)
        });

        this._chatSocket.on(PLAYER_LEAVE, (binary) => {
            playSound(PLAYER_LEAVE)
            const payload: Player = binaryToObject(binary)
            // console.log('player_leave', payload)
            if (this._onMessageSubscribers.player_leave) this._onMessageSubscribers.player_leave(payload)
        });

        this._chatSocket.on(PLAYER_READY, (binary) => {
            playSound(PLAYER_READY)
            const payload: PlayerReadyPayload = binaryToObject(binary)
            // console.log('player_ready', payload)
            if (this._onMessageSubscribers.player_ready) this._onMessageSubscribers.player_ready(payload)
        });

        this._chatSocket.on(PLAYER_KICKED, () => {
            // console.log(PLAYER_KICKED)
            if (this._onMessageSubscribers.player_kicked) this._onMessageSubscribers.player_kicked()
        });

        this._chatSocket.on(STAGE_CHANGE, (binary) => {
            playSound(STAGE_CHANGE)
            const payload: StageChangePayload = binaryToObject(binary)
            if (this._onMessageSubscribers.stage_change) this._onMessageSubscribers.stage_change(payload)
        });

        //chat

        this._chatSocket.on(MESSAGE_SENT, (binary) => {
            playSound(MESSAGE_SENT)
            const payload: PlayerMessage = binaryToObject(binary)
            // console.log('send_message', payload)
            if (this._onMessageSubscribers.message_sent) this._onMessageSubscribers.message_sent(payload)
        });

        //inside the game
        this._chatSocket.on(POSITION_CHANGE, (binary) => {
            const payload: Player = binaryToObject(binary)
            // console.log('position_change', payload)
            if (this._onMessageSubscribers.position_change) this._onMessageSubscribers.position_change(payload)
        });

        this._chatSocket.on(UPDATE, (binary) => {
            const payload: UpdatePayload = binaryToObject(binary)
            // console.log('update', payload)
            if (this._onMessageSubscribers.update) this._onMessageSubscribers.update(payload)
        });

        //effects
        this._chatSocket.on(BALL_KICKED, () => {
            playSound(BALL_KICKED)
        })
        this._chatSocket.on(GOAL, (binary) => {
            const payload: GoalPayload = binaryToObject(binary)
            playSound(GOAL)
        })
    }

    connect = () => {
        this._chatSocket.connect()
    }

    disconnect = () => {
        this._chatSocket.disconnect()
        delete this._chatSocket
    }

    _sendMessage = (type, payload) => this._chatSocket.emit(type, payload)

    requestDirectionChange = (direction: Vector) => this._sendMessage(REQUEST_DIRECTION_CHANGE, objectToBinary({ direction }))
    requestKeyPress = (code: string) => this._sendMessage(REQUEST_KEY_PRESS, objectToBinary({ code }))
    requestSendMessage = (message) => this._sendMessage(REQUEST_SEND_MESSAGE, objectToBinary({ message }))
    requestPlayerReady = (ready: boolean) => this._sendMessage(REQUEST_PLAYER_READY, objectToBinary({ ready }))
    requestChampionSelect = (champion: string) => this._sendMessage(REQUEST_CHAMPION_SELECT, objectToBinary({ champion }))
    requestKickPlayer = (id: string) => this._sendMessage(REQUEST_KICK_PLAYER, objectToBinary({ id }))
    requestChangeSide = (side: string) => this._sendMessage(REQUEST_CHANGE_SIDE, objectToBinary({ side }))


    subscribeLoginSuccess = (callback: (payload: LoginSuccessPayload) => void) => {
        this._onMessageSubscribers[LOGIN_SUCCESS] = (payload) => callback(payload)
    }
    subscribePlayerJoin = (callback: (payload: Player) => void) => {
        this._onMessageSubscribers[PLAYER_JOIN] = (payload) => callback(payload)
    }
    subscribePlayerLeave = (callback: (payload: Player) => void) => {
        this._onMessageSubscribers[PLAYER_LEAVE] = (payload) => callback(payload)
    }
    subscribePlayerReady = (callback: (payload: PlayerReadyPayload) => void) => {
        this._onMessageSubscribers[PLAYER_READY] = (payload) => callback(payload)
    }
    subscribeStageChange = (callback: (payload: StageChangePayload) => void) => {
        this._onMessageSubscribers[STAGE_CHANGE] = (payload) => callback(payload)
    }
    subscribePlayerKicked = (callback: () => void) => {
        this._onMessageSubscribers[PLAYER_KICKED] = () => callback()
    }
    //chat
    subscribeMessageSent = (callback: (payload: PlayerMessage) => void) => {
        this._onMessageSubscribers[MESSAGE_SENT] = (payload) => callback(payload)
    }
    //game
    subscribePositionChange = (callback: (payload: Player) => void) => {
        this._onMessageSubscribers[POSITION_CHANGE] = (payload) => callback(payload)
    }
    subscribeUpdate = (callback: (payload: UpdatePayload) => void) => {
        this._onMessageSubscribers[UPDATE] = (payload) => callback(payload)
    }
}
export default RoomSocket