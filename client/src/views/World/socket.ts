import { Player, PlayerMessage, SocketPayload, MessageSubscribers } from "./types"

const REQUEST_POSITION_CHANGE = 'request_position_change'
const REQUEST_SEND_MESSAGE = 'request_send_message'

const LOGIN_SUCCESS = 'login_success'
const PLAYER_JOIN = 'player_join'
const PLAYER_LEAVE = 'player_leave'
const POSITION_CHANGE = 'position_change'
const SEND_MESSAGE = 'send_message'

const chatSocket = new WebSocket('ws://' + window.location.host.replace('8000', '8080') + '/ws/chat/game/');

const sendMessage = (type, payload) => chatSocket.send(JSON.stringify({ type, ...payload }))

const onOpen = (e) => { console.log(e) }
const onError = (e) => { console.log('Chat socket closed unexpectedly') }

const onMessageSubscribers: MessageSubscribers = {}
const onMessage = (e) => {
    const payload: SocketPayload<Player | PlayerMessage> = JSON.parse(e.data);
    switch (payload.type) {
        case 'login_success':
            if (onMessageSubscribers.login_success) onMessageSubscribers.login_success(payload.data as Player)
            break;
        case 'player_join':
            if (onMessageSubscribers.player_join) onMessageSubscribers.player_join(payload.data as Player)
            break;
        case 'player_leave':
            if (onMessageSubscribers.player_leave) onMessageSubscribers.player_leave(payload.data as Player)
            break;
        case 'position_change':
            if (onMessageSubscribers.position_change) onMessageSubscribers.position_change(payload.data as Player)
            break;
        case 'send_message':
            if (onMessageSubscribers.send_message) onMessageSubscribers.send_message(payload.data as PlayerMessage)
            break;
        default:
            break;
    }
}

chatSocket.onmessage = onMessage
chatSocket.onclose = onError
chatSocket.onopen = onOpen

const requestPositionChange = (x, y) => sendMessage(REQUEST_POSITION_CHANGE, { position: { x, y } })
const requestSendMessage = (message) => sendMessage(REQUEST_SEND_MESSAGE, { message })

const subscribePlayerJoin = (callback: (payload: Player) => void) => {
    onMessageSubscribers[PLAYER_JOIN] = (payload) => callback(payload)
}
const subscribePlayerLeave = (callback: (payload: Player) => void) => {
    onMessageSubscribers[PLAYER_LEAVE] = (payload) => callback(payload)
}
const subscribePositionChange = (callback: (payload: Player) => void) => {
    onMessageSubscribers[POSITION_CHANGE] = (payload) => callback(payload)
}
const subscribeSendMessage = (callback: (payload: PlayerMessage) => void) => {
    onMessageSubscribers[SEND_MESSAGE] = (payload) => callback(payload)
}
const subscribeLoginSuccess = (callback: (payload: Player) => void) => {
    onMessageSubscribers[LOGIN_SUCCESS] = (payload) => callback(payload)
}

export default chatSocket

export {
    requestPositionChange,
    requestSendMessage,
    subscribePlayerJoin,
    subscribePlayerLeave,
    subscribePositionChange,
    subscribeSendMessage,
    subscribeLoginSuccess
}