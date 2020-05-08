// import { RectCollideable, Origin } from "./physics";
// import { Vector, Size } from "../math";

// export default class Wall extends RectCollideable {
//     _wallWidth = 10
//     _wallHeight = 10

//     constructor(position: Vector, width: number, height: number, angle: number = 0, origin?: Origin) {
//         super(0, position, width, height, angle, { isStatic: true }, origin);
//     }
// }

// export class WallBox {
//     _walls: Wall[]

//     constructor(size: Size, angle: number = 0) {

//         const ground0 = new RectCollideable(0, new Vector(-100, 0), 100, mapSize.width, null, { isStatic: true }, 'TOP_LEFT')

//         this._walls = [
//             new Wall(size.min, 0, ),
//         ]

//     }
// }