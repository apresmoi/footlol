import { RectCollideable } from "./physics";
import { Vector } from "../math";
import { IChamferableBodyDefinition } from "matter-js";
import { WallCategory } from "./categories";

export default class Wall extends RectCollideable {
    constructor(position: Vector, width: number, height: number, options?: IChamferableBodyDefinition) {
        super(0, new Vector(position.x + width / 2, position.y + height / 2),
            width, height, 0,
            {
                isStatic: true,
                ...(options ? options : {}),
                collisionFilter: {
                    category: WallCategory,
                    ...(options && options.collisionFilter ? options.collisionFilter : {})
                }
            }
        );
    }
}