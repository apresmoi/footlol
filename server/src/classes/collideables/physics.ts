import { Vector } from '../math'
import { metersToPixels } from '../../utilities/conversion'
import { g } from '../../globals'

//sources
//https://www.wired.com/2012/08/maximum-acceleration-in-the-100-m-dash/
//https://en.wikipedia.org/wiki/Elastic_collision

type ColllideableType = "Circle" | "Rectangle" | "Polygon"

export class Entity {
    _m: number
    _acceleration: Vector
    _frictionAcceleration: Vector

    _velocity: Vector
    _position: Vector
    _friction: number

    _t: number = 0
    _accelerationCurve = (dt: number) => {
        const A = metersToPixels(1.16389)
        const B = metersToPixels(0.30014)
        const C = metersToPixels(0.40157)
        const D = metersToPixels(-0.15041)
        const a = A + B * dt + C * dt * dt + D * dt * dt * dt
        return a > 0 ? a : 0
    }

    constructor(mass: number, position: Vector) {
        this._m = mass;
        this._acceleration = new Vector(0, 0);
        this._velocity = new Vector(0, 0);
        this._position = position;
    }

    _shouldEvolve() {
        return this._acceleration.round().module() || this._velocity.round().module()
    }

    applyImpulse(direction: Vector, dt: number) {
        if (direction.module() && !direction.normalize().isEqual(this._velocity.normalize())) {
            this._velocity = direction.normalize().multiply(this._velocity.module());
        }

        if (direction.module()) {
            this._t = dt
            this._acceleration = direction.multiply(this._accelerationCurve(this._t)).round();
        } else {
            this._t = 0;
            this._acceleration = new Vector(0, 0)
        }
    }

    _updateAcceleration(dt: number) {
        this._t += dt
        this._acceleration = this._acceleration.normalize().multiply(this._accelerationCurve(this._t)).round();
    }

    _updateVelocity(dt: number) {
        this._velocity = this._velocity.add(this._acceleration.multiply(dt))
    }

    _updatePosition(dt: number) {
        this._position = this._position
            .add(this._velocity.multiply(dt))
            .round();
    }

    evolve(dt: number) {
        if (this._shouldEvolve()) {
            this._updateAcceleration(dt);
            this._updateVelocity(dt);
            this._updatePosition(dt);
            console.log("pos", this._position)
            console.log("vel", this._velocity)
            console.log("acc", this._acceleration)
            return true
        }
        return false
    }
}

export class Collideable extends Entity {
    _type: ColllideableType

    constructor(mass: number, position: Vector) {
        super(mass, position);
    }
}

export class CircleCollideable extends Collideable {
    _type = "Circle" as ColllideableType;

    _radius: number;

    constructor(mass: number, position: Vector, radius: number) {
        super(mass, position);
        this._radius = radius;
    }
}

export class RectCollideable extends Collideable {
    _type = "Rectangle" as ColllideableType;

    _width: number
    _height: number
    _rotation: number

    constructor(mass: number, position: Vector, height: number, width: number, rotation: number) {
        super(mass, position);
        this._height = height;
        this._width = width;
        this._rotation = rotation;
    }
}

export class PolygonCollideable extends Collideable {
    _type = "Polygon" as ColllideableType;

    _points: Vector[]

    constructor(mass: number, position: Vector, points: Vector[]) {
        super(mass, position);
        this._points = points;
    }
}