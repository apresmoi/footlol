export interface Player {
    id: string
    direction: {
        dx: number
        dy: number
    }
    position: {
        x: number
        y: number
    }
}

export interface PlayerMessage {
    id: string
    message: string
}

export type MessageSubscribers = {
    login_success?: (payload: Player) => void
    player_join?: (payload: Player) => void
    player_leave?: (payload: Player) => void
    position_change?: (payload: Player) => void
    send_message?: (payload: PlayerMessage) => void
    update?: (payload: { [x: string]: Player }) => void
}