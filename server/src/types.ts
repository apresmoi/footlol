import { IEventCollision, Engine, IPair, Body } from "matter-js"
import { Collideable } from "./classes/collideables/physics"
import Player from "./classes/collideables/player"

export type RoomStage = 'TEAM_SELECT' | 'CHAMPION_SELECT' | 'FIELD'
export type TeamSide = 'LEFT' | 'RIGHT'
export type RoomSensors = 'LEFT_GOAL' | 'RIGHT_GOAL'
export type ResetType = 'GOAL' | 'RESET'

export interface ICollideableBody extends Body {
    plugin: Collideable
}

export interface ICollideablePair extends IPair {
    bodyA: ICollideableBody;
    bodyB: ICollideableBody;
}

export interface ICollideableEventCollision extends IEventCollision<Engine> {
    pairs: Array<ICollideablePair>;
}

export type IChatMessage = {
    player: Player,
    message: string,
    date: Date
}