export class Vector {
    _x: number
    _y: number

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    module(): number {
        return Math.sqrt(this._x * this._x + this._y * this._y)
    }

    normalize(): Vector {
        const module = this.module();
        return new Vector(this._x / module, this._y / module);
    }

    scale(n: number): Vector {
        return new Vector(this._x * n, this._y * n)
    }

    add(v: Vector): Vector {
        return new Vector(this._x + v._x, this._y + v._y);
    }

    substract(v: Vector): Vector {
        return new Vector(this._x - v._x, this._y - v._y);
    }

    dot(v: Vector): number {
        return this._x * v._x + this._y * v._y
    }

    angle(v: Vector): number {
        return Math.acos(this.dot(v) / (this.module() * v.module()))
    }
}

type ColllideableType = "Circle" | "Rectangle"

export class Collideable {
    _m: number
    _acceleration: Vector
    _velocity: Vector
    _position: Vector
    _type: ColllideableType

    constructor(mass: number, position: Vector) {
        this._m = mass
        this._acceleration = new Vector(0, 0);
        this._velocity = new Vector(0, 0);
        this._position = position;
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
