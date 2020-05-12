import { CircleCollideable } from "./physics";
import { ballRadius, ballMass } from "../../globals";
import { Vector } from "../math";
import Player from "./player";
import { BallCategory } from "./categories";

export type BallKicker = { player: Player, seconds: number }
export default class Ball extends CircleCollideable {
    _kickers: BallKicker[] = []

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
            player,
            seconds
        })
    }

    getLastKicker(): BallKicker | null {
        if (this._kickers.length) {
            return this._kickers[this._kickers.length - 1]
        }
        return null
    }
}