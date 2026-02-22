import { IEventCollision, Engine, Pair, Body } from "matter-js"
import { Collideable } from "./classes/collideables/physics"
import Player from "./classes/collideables/player"

export type RoomStage = 'TEAM_SELECT' | 'CHAMPION_SELECT' | 'FIELD' | 'END'
export type TeamSide = 'LEFT' | 'RIGHT'
export type VictoryResult = 'LEFT' | 'RIGHT' | 'TIE'
export type RoomSensors = 'LEFT_GOAL' | 'RIGHT_GOAL'
export type ResetType = 'GOAL' | 'RESET'

export interface ICollideableBody extends Body {
    plugin: {
        owner: Collideable,
        drawer: Collideable,
        id?: string,
        duration?: number,
        effectDuration?: number,
        velocity?: number,
        angularVelocity?: number,
        cooldown?: number,
        handleCollision?: (target?: Collideable) => void
    }
}

export type ICollideablePair = Pair & {
    bodyA: ICollideableBody;
    bodyB: ICollideableBody;
}

export interface ICollideableEventCollision extends IEventCollision<Engine> {
    pairs: Array<ICollideablePair>;
}

export interface RoomConfig {
    matchDurationSeconds: number
    maxPlayersPerTeam: number
}

export type IChatMessage = {
    player: Player,
    message: string,
    date: Date
}
