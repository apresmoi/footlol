import { Player, PlayerMessage, MessageSubscribers } from "./types"
import io from 'socket.io-client';

const REQUEST_POSITION_CHANGE = 'request_position_change'
const REQUEST_SEND_MESSAGE = 'request_send_message'

const LOGIN_SUCCESS = 'login_success'
const PLAYER_JOIN = 'player_join'
const PLAYER_LEAVE = 'player_leave'
const POSITION_CHANGE = 'position_change'
const SEND_MESSAGE = 'send_message'
const UPDATE = 'update'

const chatSocket = io(window.location.host.replace('8000', '8081'), {
    path: '/'
});
// const chatSocket = new WebSocket('ws://' + window.location.host.replace('8000', '8080') + '/ws/chat/game/');

const sendMessage = (type, payload) => chatSocket.emit(type, payload)

const onMessageSubscribers: MessageSubscribers = {}

chatSocket.on('login_success', (payload: Player) => {
    console.log('login_success', payload)
    if (onMessageSubscribers.login_success) onMessageSubscribers.login_success(payload)
});

chatSocket.on('player_join', (payload: Player) => {
    console.log('player_join', payload)
    if (onMessageSubscribers.player_join) onMessageSubscribers.player_join(payload)
});

chatSocket.on('player_leave', (payload: Player) => {
    console.log('player_leave', payload)
    if (onMessageSubscribers.player_leave) onMessageSubscribers.player_leave(payload)
});

chatSocket.on('position_change', (payload: Player) => {
    console.log('position_change', payload)
    if (onMessageSubscribers.position_change) onMessageSubscribers.position_change(payload)
});

chatSocket.on('send_message', (payload: PlayerMessage) => {
    console.log('send_message', payload)
    if (onMessageSubscribers.send_message) onMessageSubscribers.send_message(payload)
});

chatSocket.on('update', (payload: { [x: string]: Player }) => {
    console.log('update', payload)
    if (onMessageSubscribers.update) onMessageSubscribers.update(payload)
});

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
const subscribeUpdate = (callback: (payload: { [x: string]: Player }) => void) => {
    onMessageSubscribers[UPDATE] = (payload) => callback(payload)
}

export default chatSocket

export {
    requestPositionChange,
    requestSendMessage,
    subscribePlayerJoin,
    subscribePlayerLeave,
    subscribePositionChange,
    subscribeSendMessage,
    subscribeLoginSuccess,
    subscribeUpdate
}