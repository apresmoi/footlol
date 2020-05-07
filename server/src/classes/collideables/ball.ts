import { CircleCollideable } from "./physics";
import { ballRadius, ballMass } from "../../globals";
import { Vector } from "../math";

export default class Ball extends CircleCollideable {
    constructor(position: Vector) {
        super(ballMass, position, ballRadius);
        this._friction = 1
    }

    serialize() {
        return {
            position: this._position.serialize()
        }
    }
}