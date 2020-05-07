import { round } from "../utilities/numbers";

export class Size {
    _width: number
    _height: number

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
    }
}

export class Vector {
    _x: number
    _y: number

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    module(): number {
        return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2))
    }

    normalize(): Vector {
        const module = this.module();
        if (module > 0)
            return new Vector(this._x / module, this._y / module);
        return this
    }

    invert(): Vector {
        return this.multiply(-1)
    }

    multiply(n: number): Vector {
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

    toArray(): [number, number] {
        return [this._x, this._y]
    }

    round(): Vector {
        return new Vector(round(this._x), round(this._y))
    }

    isEqual(v: Vector) {
        return this._x === v._x && this._y === v._y
    }

    serialize() {
        return {
            x: this._x,
            y: this._y
        }
    }
}
