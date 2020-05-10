import { CircleCollideable } from "./physics";
import { ballRadius, ballMass } from "../../globals";
import { Vector } from "../math";
import { Body } from "matter-js";
import Player from "./player";

export type Kicker = { playerId: string, seconds: number }
export const BallCategory = 0x0002
export default class Ball extends CircleCollideable {
    _kickers: Kicker[] = []

    constructor(position: Vector) {
        super(ballMass, position, ballRadius, {
            restitution: 0.9,
            collisionFilter: {
                category: BallCategory
            }
        });
    }

    addKicker(seconds: number, player: Player): void {
        this._kickers.push({
            playerId: player._id,
            seconds
        })
    }

    getLastKicker(): Kicker | null {
        if (this._kickers.length) {
            return this._kickers[this._kickers.length - 1]
        }
        return null
    }
}