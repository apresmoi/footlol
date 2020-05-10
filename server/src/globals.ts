import { Vector, Size } from "./classes/math"
import { RoomSide } from "./types";

export const time: number = 20;
export const ballRadius: number = 12;
export const ballMass: number = 1;
export const playerRadius: number = 25;
export const playerActionRadius: number = 40;
export const fieldCircleRadius: number = 140;
export const mapSize: Size = new Size(0, 0, 2050, 1000);
export const mapInnerSize: Size = new Size(0, 0, 1900, 830);
export const g = 9.8// m / s^2
export const goalSize: Size = new Size(0, 0, 60, 1000 / 3)


const LEFT_FRONT_TOP = new Vector(mapSize.center.x - 250, mapSize.center.y - 100)
const LEFT_FRONT_BOT = new Vector(mapSize.center.x - 250, mapSize.center.y + 100)
const LEFT_KEEPER = new Vector(mapSize.center.x - 850, mapSize.center.y)
const LEFT_BACK_TOP = new Vector(mapSize.center.x - 550, mapSize.center.y - 350)
const LEFT_BACK_MIDDLE = new Vector(mapSize.center.x - 550, mapSize.center.y + 350)

const RIGHT_FRONT_TOP = new Vector(mapSize.center.x + 250, mapSize.center.y - 100)
const RIGHT_FRONT_BOT = new Vector(mapSize.center.x + 250, mapSize.center.y + 100)
const RIGHT_KEEPER = new Vector(mapSize.center.x + 850, mapSize.center.y)
const RIGHT_BACK_TOP = new Vector(mapSize.center.x + 550, mapSize.center.y - 350)
const RIGHT_BACK_MIDDLE = new Vector(mapSize.center.x + 550, mapSize.center.y + 350)

export const playerPositions: { [side in RoomSide]: Vector[] } = {
    'LEFT': [
        LEFT_FRONT_BOT,
        LEFT_FRONT_TOP,
        LEFT_KEEPER,
        LEFT_BACK_TOP,
        LEFT_BACK_MIDDLE,
    ],
    'RIGHT': [
        RIGHT_FRONT_TOP,
        RIGHT_FRONT_BOT,
        RIGHT_KEEPER,
        RIGHT_BACK_MIDDLE,
        RIGHT_BACK_TOP,
    ]
}
