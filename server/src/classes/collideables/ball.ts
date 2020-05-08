import { CircleCollideable } from "./physics";
import { ballRadius, ballMass } from "../../globals";
import { Vector } from "../math";

export default class Ball extends CircleCollideable {
    constructor(position: Vector) {
        super(ballMass, position, ballRadius, {
            restitution: 0.9
        });
    }

    update() {
        // if (this._body.speed < 0.1) {
        //     this.setVelocity(new Vector(0, 0));
        // }
        // super.update();
        console.log(this._body.speed)
    }
}