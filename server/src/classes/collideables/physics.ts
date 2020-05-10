import { Bodies, Body, World, Vertices } from 'matter-js'
import { Vector } from '../math'

//sources
//https://www.wired.com/2012/08/maximum-acceleration-in-the-100-m-dash/
//https://en.wikipedia.org/wiki/Elastic_collision
//https://github.com/liabru/matter-js/

export class Collideable {
    _body: Body
    _direction: Vector
    _acceleration: number
    _startPosition: Vector

    _mounted: boolean

    constructor(position: Vector) {
        this._direction = new Vector(0, 0);
        this._acceleration = 0;
        this._startPosition = position
    }

    materialize(world: World) {
        if (!this._mounted) {
            this._mounted = true;
            World.add(world, this._body);
        }
    }

    dematerialize(world: World) {
        if (this._mounted) {
            this._mounted = false;
            World.remove(world, this._body);
        }
    }

    resetPosition(world: World): void {
        this.dematerialize(world)
        Body.setPosition(this._body, this._startPosition);
        this.materialize(world)
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
        if (this._body.speed > 0 && this._body.speed < 0.01) {
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
        super(position);
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
        options?: Matter.IChamferableBodyDefinition) {
        super(position);

        this._body = Bodies.rectangle(position.x, position.y, width, height, {
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
        super(position);

        this._body = Bodies.fromVertices(position.x, position.y, points, {
            mass,
            ...(options ? options : {}),
        })
    }
}

export class CompoundCollideable extends Collideable {
    constructor(position: Vector) {
        super(position);
    }

    static fromCollideables(position: Vector, collideables: Collideable[], options?: Matter.IBodyDefinition): CompoundCollideable {
        const collideable = new CompoundCollideable(position);
        collideable._body = Body.create({
            ...(options ? options : {}),
            parts: collideables.map(collideable => collideable._body),
        });
        return collideable
    }
}