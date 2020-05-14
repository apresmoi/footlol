import { CircleCollideable } from "./physics";
import { Vector } from "../math";
import { Body, Vertices } from "matter-js";

export default class VectorCollideable extends CircleCollideable {
    constructor(mass: number, position: Vector, radius: number, options?: Matter.IBodyDefinition) {
        super(mass, position, radius, options)
    }

    serialize(): any {
        const distanceVector = Vector.fromMatter(this._body.position).substract(this._body.plugin.owner.getPosition())
        return {
            type: 'rect',
            position: this._body.plugin.owner.getPosition(),
            angle: distanceVector.angle(),
            width: distanceVector.module(),
            height: this._body.circleRadius
        }
    }
}