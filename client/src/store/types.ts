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
    ready: boolean
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

export type RoomStage = 'TEAM_SELECT' | 'CHAMPION_SELECT' | 'FIELD'

export interface PlayerMessage {
    name: string
    message: string
}

export interface PlayerReadyPayload {
    player: Player
    ready: boolean
}

export interface StageChangePayload {
    stage: RoomStage
}

export interface UpdatePayload {
    players: { [id: string]: Player }
    ball: Ball
    score: Score
    time: number
    stage: RoomStage
}

export interface LoginSuccessPayload extends UpdatePayload {
    self: Player
}

export type MessageSubscribers = {
    login_success?: (payload: LoginSuccessPayload) => void
    player_join?: (payload: Player) => void
    player_leave?: (payload: Player) => void
    player_ready?: (payload: PlayerReadyPayload) => void
    stage_change?: (payload: StageChangePayload) => void
    position_change?: (payload: Player) => void
    message_sent?: (payload: PlayerMessage) => void
    update?: (payload: UpdatePayload) => void
}