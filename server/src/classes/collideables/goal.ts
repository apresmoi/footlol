


import { PolygonCollideable, CircleCollideable } from "./physics";
import { goalSize, mapSize } from "../../globals";
import { Vector } from "../math";
import { IChamferableBodyDefinition, World, Body } from "matter-js";
import { TeamSide } from "../../types";

export const GoalCategory = 0x0008
export default class Goal extends PolygonCollideable {
    _bodyGoalStickLeft: CircleCollideable
    _bodyGoalStickRight: CircleCollideable
    _sensor: PolygonCollideable

    constructor(position: Vector, side: TeamSide, options?: IChamferableBodyDefinition) {
        const top = mapSize.center.y - goalSize.height / 2
        const bottom = mapSize.center.y + goalSize.height / 2
        const points = side === 'RIGHT' ? [
            new Vector(0, top),
            new Vector(goalSize.width + 5, top + 5),
            new Vector(goalSize.width + 5, bottom - 5),
            new Vector(0, bottom),

            new Vector(0, bottom - 5),
            new Vector(goalSize.width - 10, bottom - 5),
            new Vector(goalSize.width - 10, top + 5),
            new Vector(0, top + 5),
        ] : [
                // const leftPoints = [[0, bottom], [-mapSize.goal.width, bottom - 5], [-mapSize.goal.width, top + 5], [0, top]];
                new Vector(5, bottom),
                new Vector(-goalSize.width + 5, bottom - 5),
                new Vector(-goalSize.width + 5, top + 5),
                new Vector(5, top),

                new Vector(5, top + 5),
                new Vector(-goalSize.width + 10, top + 5),
                new Vector(-goalSize.width + 10, bottom - 5),
                new Vector(5, bottom - 5),
            ]

        super(0, position.setX(position.x + goalSize.width / 2 + 10), [points], {
            isStatic: true,
            ...(options ? options : {}),
            collisionFilter: {
                category: GoalCategory,
                ...(options && options.collisionFilter ? options.collisionFilter : {}),
            }
        });

        this._bodyGoalStickLeft = new CircleCollideable(0, position
            .setX(side === 'RIGHT' ? position.x : position.x + goalSize.width + 15)
            .setY(position.y - goalSize.height / 2)
            ,
            10,
            {
                isStatic: true,
                ...(options ? options : {}),
                collisionFilter: {
                    category: GoalCategory,
                    ...(options && options.collisionFilter ? options.collisionFilter : {}),
                },
                plugin: this,
            })

        this._bodyGoalStickRight = new CircleCollideable(0, position
            .setX(side === 'RIGHT' ? position.x : position.x + goalSize.width + 15)
            .setY(position.y + goalSize.height / 2)
            ,
            10,
            {
                isStatic: true,
                ...(options ? options : {}),
                collisionFilter: {
                    category: GoalCategory,
                    ...(options && options.collisionFilter ? options.collisionFilter : {}),
                },
                plugin: this
            })

        this._sensor = new PolygonCollideable(0, position.setX(position.x + goalSize.width / 2 + 10), [points.slice(0, 4)], {
            isStatic: true,
            isSensor: true,
            ...(options ? options : {}),
            collisionFilter: {
                category: GoalCategory,
                ...(options && options.collisionFilter ? options.collisionFilter : {}),
            },
            plugin: this
        })
    }

    checkSensor(body: Body): boolean {
        return body.parent.id === this._sensor._body.id
    }

    materialize(world: World) {
        super.materialize(world);
        World.add(world, this._bodyGoalStickLeft._body);
        World.add(world, this._bodyGoalStickRight._body);
        World.add(world, this._sensor._body);
    }

    dematerialize(world: World) {
        super.materialize(world);
        World.remove(world, this._bodyGoalStickLeft._body);
        World.remove(world, this._bodyGoalStickRight._body);
        World.remove(world, this._sensor._body);
    }

}


