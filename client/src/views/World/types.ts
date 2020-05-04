type SocketPayloadType = 'login_success' | 'player_join' | 'position_change' | 'send_message' | 'player_leave'

export interface Player {
    name: string
    position: {
        x: number
        y: number
    }
}

export interface PlayerMessage {
    name: string
    message: string
}

export interface SocketPayload<T> {
    type: SocketPayloadType
    data: T
}

export type MessageSubscribers = {
    login_success?: (payload: Player) => void
    player_join?: (payload: Player) => void
    player_leave?: (payload: Player) => void
    position_change?: (payload: Player) => void
    send_message?: (payload: PlayerMessage) => void
}