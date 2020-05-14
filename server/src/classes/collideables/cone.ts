import { PolygonCollideable } from "./physics";
import { Vector } from "../math";
import { Body, Vertices } from "matter-js";

export default class Cone extends PolygonCollideable {
    _radius: number
    _direction: Vector

    constructor(mass: number, position: Vector, radius: number, aperture: number, options?: Matter.IBodyDefinition) {
        const InnerLeft = new Array(10).fill(0).map((_x, i, arr) => new Vector(
            Math.round(radius * Math.cos(aperture * i / (arr.length - 1) - aperture / 2)),
            Math.round(radius * Math.sin(aperture * i / (arr.length - 1) - aperture / 2))
        ))

        super(mass, position, [[
            position,
            ...InnerLeft
        ]], options)

        this._radius = radius
    }

    setVelocity(velocity: Vector, angularVelocity: number = 0): void {
        if (velocity.x > 0 && velocity.y > 0) {
            Body.rotate(this._body, - this._body.angle + Math.PI / 4)
        }
        else if (velocity.x > 0 && velocity.y < 0) {
            Body.rotate(this._body, - this._body.angle - Math.PI / 4)
        }
        else if (velocity.x < 0 && velocity.y < 0) {
            Body.rotate(this._body, - this._body.angle - Math.PI * 3 / 4)
        }
        else if (velocity.x < 0 && velocity.y > 0) {
            Body.rotate(this._body, - this._body.angle + Math.PI * 3 / 4)
        }
        else if (velocity.x < 0) {
            Body.rotate(this._body, - this._body.angle - Math.PI)
        }
        else if (velocity.y < 0) {
            Body.rotate(this._body, - this._body.angle - Math.PI / 2)
        }
        else if (velocity.y > 0) {
            Body.rotate(this._body, - this._body.angle + Math.PI / 2)
        }
        else if (velocity.x > 0) {
            Body.rotate(this._body, - this._body.angle)
        }
        this._direction = velocity.normalize()
        super.setVelocity(velocity, angularVelocity)
    }

    setPosition(position: Vector): void {
        Body.setPosition(this._body, position.substract(new Vector(this._direction.x * this._body.bounds.min.x, this._direction.y * this._body.bounds.min.y)));
    }

    serialize(): any {
        return {
            type: 'polygon',
            position: this._body.plugin.owner.getPosition(),// this.getPosition().serialize(),
            angle: this.getAngle(),
            points: this.getPoints()
        }
    }
}