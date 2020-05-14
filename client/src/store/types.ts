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
    cooldown: {
        Q: number
        W: number
    }
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

export type RoomStage = 'TEAM_SELECT' | 'CHAMPION_SELECT' | 'FIELD' | 'END'

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

export interface EffectImage {
    src: string
    x: number
    y: number
    w: number
    h: number
}

export interface Effect {
    id: string
    type: 'circle' | 'rect' | 'compound' | 'ring' | 'polygon'
    position: Vector
    image: EffectImage
    direction: Vector
    angle: number
}
export interface CircleEffect extends Effect {
    type: 'circle'
    radius: number
}
export interface RectEffect extends Effect {
    type: 'rect'
    width: number
    height: number
}
export interface CompoundEffect extends Effect {
    type: 'compound'
}
export interface RingEffect extends Effect {
    type: 'ring'
    radius: number
    thickness: number
}
export interface PolygonEffect extends Effect {
    type: 'polygon'
    points: [number, number][]
}


export interface UpdatePayload {
    players: { [id: string]: Player }
    ball: Ball
    score: Score
    time: number
    stage: RoomStage
    effects: Array<CircleEffect | RectEffect | CompoundEffect>
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

export type Champion = {
    name: string,
    spells: {
        Q: {
            id: string,
            sprite: string,
            x: number,
            y: number,
            w: number,
            h: number,
            cooldown: number,
        },
        W: {
            id: string,
            sprite: string,
            x: number,
            y: number,
            w: number,
            h: number,
            cooldown: number,
        }
    }
}

export type Room = {
    id: string
    name: string
    players: number
}
export interface ApplicationContextProviderState {
    name: string
    champion?: string
    roomId?: string
    rooms: Room[]
    stage: RoomStage
    champions: Champion[]
    self?: Player
    ball?: Ball
    score?: Score
    time?: number
    effects: Array<CircleEffect | RectEffect | CompoundEffect>
    debug: Array<Effect>,
    players: { [x: string]: Player }
    victory?: 'LEFT' | 'RIGHT'
    countdown?: number
}