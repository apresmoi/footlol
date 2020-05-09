import { RectCollideable } from "./physics";
import { ballRadius, ballMass } from "../../globals";
import { Vector } from "../math";
import { Constraint, IChamferableBodyDefinition } from "matter-js";

export const WallCategory = 0x0001
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