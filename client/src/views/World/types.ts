export interface Vector {
    x: number
    y: number
}

export interface Player {
    id: string
    name: string
    champion: string
    kicking: boolean
    direction: Vector
    position: Vector
    side: 'LEFT' | 'RIGHT'
}

export interface Ball {
    position: Vector
    angle: number
}

export interface Score {
    left: number
    right: number
}

export interface PlayerMessage {
    id: string
    message: string
}


export interface UpdatePayload {
    players: { [id: string]: Player }
    ball: Ball
    score: Score
    time: number
}

export type MessageSubscribers = {
    login_success?: (payload: Player) => void
    player_join?: (payload: Player) => void
    player_leave?: (payload: Player) => void
    position_change?: (payload: Player) => void
    send_message?: (payload: PlayerMessage) => void
    update?: (payload: UpdatePayload) => void
}