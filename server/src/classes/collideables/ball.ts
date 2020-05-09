import { CircleCollideable } from "./physics";
import { ballRadius, ballMass } from "../../globals";
import { Vector } from "../math";
import { Body } from "matter-js";

export const BallCategory = 0x0002
export default class Ball extends CircleCollideable {
    _startPosition: Vector

    constructor(position: Vector) {
        super(ballMass, position, ballRadius, {
            restitution: 0.9,
            collisionFilter: {
                category: BallCategory
            }
        });

        this._startPosition = position
    }

    reset(): void {
        this.setVelocity(new Vector(0, 0));
        this.setPosition(this._startPosition);
    }
}