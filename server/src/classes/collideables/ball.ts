import { CircleCollideable } from "./physics";
import { ballRadius, ballMass, mapSize } from "../../globals";
import { Vector } from "../math";
import Player from "./player";
import { BallCategory } from "./categories";

export type BallKicker = { player: Player, seconds: number }
export default class Ball extends CircleCollideable {
    _kickers: BallKicker[] = []
    _kicked: boolean = false

    constructor(position: Vector) {
        super(ballMass, position, ballRadius, {
            restitution: 0.9,
            frictionAir: 0.02,
            collisionFilter: {
                category: BallCategory,
            },
        });
        this._body.plugin.owner = this
        this._movementBounds = [new Vector(0, 0), new Vector(mapSize.width, mapSize.height)]
    }

    clearKickers(): void {
        this._kickers = []
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