import { Bodies, Body, World } from 'matter-js'
import { Vector } from '../math'

export type Origin = 'TOP_LEFT' | 'CENTER_OF_MASS'


//sources
//https://www.wired.com/2012/08/maximum-acceleration-in-the-100-m-dash/
//https://en.wikipedia.org/wiki/Elastic_collision
//https://github.com/liabru/matter-js/

export class Collideable {
    _body: Body
    _direction: Vector
    _acceleration: number

    constructor() {
        this._direction = new Vector(0, 0);
        this._acceleration = 0;
    }

    materialize(world: World) {
        World.add(world, this._body);
    }

    dematerialize(world: World) {
        World.remove(world, this._body);
    }

    getPosition(): Vector {
        return Vector.fromMatter(this._body.position);
    }

    getAngle(): number {
        return this._body.angle;
    }

    changeDirection(direction: Vector): void {
        this._direction = direction;
    }

    setVelocity(velocity: Vector): void {
        Body.setVelocity(this._body, velocity);
    }

    setPosition(position: Vector): void {
        Body.setPosition(this._body, position);
    }

    update() {
        if (this._body.speed < 0.01) {
            this.setVelocity(new Vector(0, 0));
        }
    }

    serialize() {
        return {
            position: this.getPosition().serialize(),
            angle: this.getAngle()
        }
    }
}

export class CircleCollideable extends Collideable {
    constructor(mass: number, position: Vector, radius: number,
        options?: Matter.IBodyDefinition) {
        super();
        this._body = Bodies.circle(position.x, position.y, radius, {
            mass,
            ...(options ? options : {}),
        })
    }
}

export class RectCollideable extends Collideable {
    constructor(mass: number,
        position: Vector,
        width: number,
        height: number,
        angle: number = 0,
        options?: Matter.IChamferableBodyDefinition,
        origin?: Origin) {
        super();

        let _position = position.copy();

        if (origin) {
            switch (origin) {
                case 'TOP_LEFT':
                    _position = _position.setX(_position.x + width / 2).setY(_position.y + height / 2)
                    break;
                case 'CENTER_OF_MASS':
                default:
                    break;
            }
        }

        console.log(_position, width, height)

        this._body = Bodies.rectangle(_position.x, _position.y, width, height, {
            mass,
            angle,
            ...(options ? options : {}),
        })
    }
}

export class PolygonCollideable extends Collideable {
    constructor(mass: number,
        position: Vector,
        points: Vector[][],
        options?: Matter.IBodyDefinition) {
        super();
        this._body = Bodies.fromVertices(position.x, position.y, points, {
            mass,
            ...(options ? options : {}),
        })
    }
}