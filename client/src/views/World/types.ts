export interface Vector {
    x: number
    y: number
}

export interface Player {
    id: string
    name: string
    champion: string
    shooting: boolean
    direction: Vector
    position: Vector
}

export interface Ball {
    position: Vector
}


export interface PlayerMessage {
    id: string
    message: string
}


export interface UpdatePayload {
    players: { [id: string]: Player }
    ball: Ball
}

export type MessageSubscribers = {
    login_success?: (payload: Player) => void
    player_join?: (payload: Player) => void
    player_leave?: (payload: Player) => void
    position_change?: (payload: Player) => void
    send_message?: (payload: PlayerMessage) => void
    update?: (payload: UpdatePayload) => void
}