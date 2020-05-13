import { PolygonCollideable } from "./physics";
import { Vector } from "../math";
import { Body } from "matter-js";

export default class Ring extends PolygonCollideable {
    _radius: number
    _thickness: number

    constructor(mass: number, position: Vector, radius: number, thickness: number, options?: Matter.IBodyDefinition) {
        const Inner = new Array(100).fill(0).map((_x, i, arr) => new Vector(
            position.x + (radius) * Math.cos(2 * Math.PI * (i) / (arr.length - 1)),
            position.y + (radius) * Math.sin(2 * Math.PI * (i) / (arr.length - 1))
        ))

        const Outer = new Array(100).fill(0).map((_x, i, arr) => new Vector(
            position.x + (radius + thickness) * Math.cos(2 * Math.PI * (arr.length - i - 1) / (arr.length - 1)),
            position.y + (radius + thickness) * Math.sin(2 * Math.PI * (arr.length - i - 1) / (arr.length - 1))
        ))


        super(mass, position, [[...Inner, ...Outer,]], options)
        Body.setMass(this._body, mass)
        this._radius = radius
        this._thickness = thickness
    }


    serialize(): any {
        return {
            type: 'ring',
            position: this.getPosition().serialize(),
            angle: this.getAngle(),
            radius: this._radius,
            thickness: this._thickness
        }
    }
}