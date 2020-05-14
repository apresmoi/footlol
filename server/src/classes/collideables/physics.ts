import { Bodies, Body, World, Vertices } from 'matter-js'
import { Vector } from '../math'
import { ICollideableBody } from '../../types'

//sources
//https://www.wired.com/2012/08/maximum-acceleration-in-the-100-m-dash/
//https://en.wikipedia.org/wiki/Elastic_collision
//https://github.com/liabru/matter-js/

export class Collideable {
    _id: string = null
    _body: ICollideableBody
    _direction: Vector
    _acceleration: number
    _startPosition: Vector

    _mounted: boolean = false
    _mountedTS: Date = null
    _expired: boolean = false

    _alreadyCollided: string[] = []

    _world: World

    constructor(position: Vector) {
        this._direction = new Vector(0, 0);
        this._acceleration = 0;
        this._startPosition = position
    }

    getLife(): number {
        if (this._mounted && this._mountedTS)
            return (new Date().getTime() - this._mountedTS.getTime())
        return 0
    }

    materialize(world: World) {
        if (!this._mounted) {
            this._world = world
            this._alreadyCollided = []
            this._mounted = true;
            this._mountedTS = new Date()
            World.add(world, this._body);
            console.log("materialize")
        }
    }

    dematerialize() {
        if (this._mounted && this._world) {
            this._mounted = false;
            this._mountedTS = null
            World.remove(this._world, this._body);
            console.log("dematerialize")
        }
    }

    resetPosition(world: World = null): void {
        if (world) this.dematerialize()
        Body.setPosition(this._body, this._startPosition);
        if (world) this.materialize(world)
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

    addCollision(withID: string): void {
        this._alreadyCollided.push(withID)
    }

    hasAlreadyCollided(widthID: string): boolean {
        return this._alreadyCollided.includes(widthID)
    }

    setStun(timeout: number): void {
        const self = this;
        if (!self._body.isStatic) {
            const mass = self._body.mass
            const inertia = self._body.inertia
            Body.setStatic(self._body, true)
            setTimeout(() => {
                self.setVelocity(new Vector(0, 0), 0)
                Body.setStatic(self._body, false)
                Body.setMass(self._body, mass)
                Body.setInertia(self._body, inertia)
            }, timeout);
        }
    }

    setVelocity(velocity: Vector, angularVelocity: number = 0): void {
        Body.setVelocity(this._body, velocity);
        Body.setAngularVelocity(this._body, angularVelocity);
    }

    getVelocity(): Vector {
        return Vector.fromMatter(this._body.velocity)
    }

    setPosition(position: Vector): void {
        Body.setPosition(this._body, position);
    }

    update(dt: number): void {
        if (this._body.speed > 0 && this._body.speed < 0.01) {
            this.setVelocity(new Vector(0, 0));
        }
    }

    getPoints() {
        if (this._body.parts.length > 1)
            return this._body.parts.map(x => [x.position.x, x.position.y])
        return this._body.vertices.map(x => [x.x, x.y])
    }

    serialize(): any {
        return {
            type: 'none',
            position: this.getPosition().serialize(),
            angle: this.getAngle(),
            direction: this.getVelocity().director()
        }
    }
}

export class CircleCollideable extends Collideable {
    constructor(mass: number, position: Vector, radius: number,
        options?: Matter.IBodyDefinition) {
        super(position);
        this._body = Bodies.circle(position.x, position.y, radius, {
            plugin: {
                owner: this,
            },
            mass,
            ...(options ? options : {}),
        })
    }

    serialize(): any {
        return {
            type: 'circle',
            position: this.getPosition().serialize(),
            angle: this.getAngle(),
            radius: this._body.circleRadius,
            direction: this.getVelocity().director()
        }
    }
}

export class RectCollideable extends Collideable {
    _width: number
    _height: number

    constructor(mass: number,
        position: Vector,
        width: number,
        height: number,
        angle: number = 0,
        options?: Matter.IChamferableBodyDefinition) {
        super(position);

        this._body = Bodies.rectangle(position.x, position.y, width, height, {
            plugin: {
                owner: this,
            },
            mass,
            angle,
            ...(options ? options : {}),
        })
    }

    serialize(): any {
        return {
            type: 'rect',
            position: this.getPosition().serialize(),
            angle: this.getAngle(),
            width: this._width,
            height: this._height,
            direction: this.getVelocity().director()
        }
    }
}

export class PolygonCollideable extends Collideable {
    constructor(mass: number,
        position: Vector,
        points: Vector[][],
        options?: Matter.IBodyDefinition) {
        super(position);

        this._body = Bodies.fromVertices(position.x, position.y, points, {
            plugin: {
                owner: this,
            },
            mass,
            ...(options ? options : {}),
        }, null, null, 0)
    }

    serialize(): any {
        return {
            type: 'polygon',
            position: this.getPosition().serialize(),
            angle: this.getAngle(),
            points: this.getPoints(),
            direction: this.getVelocity().director()
        }
    }
}

export class CompoundCollideable extends Collideable {
    constructor(position: Vector) {
        super(position);
    }

    static fromCollideables(position: Vector, collideables: Collideable[], options?: Matter.IBodyDefinition): CompoundCollideable {
        const collideable = new CompoundCollideable(position);
        collideable._body = Body.create({
            plugin: {
                owner: this,
            },
            ...(options ? options : {}),
            parts: collideables.map(collideable => collideable._body),
        });
        return collideable
    }
}