import { PolygonCollideable } from "./physics";
import { mapSize, fieldCircleRadius } from "../../globals";
import { TeamSide } from "../../types";
import { Vector } from "../math";
import { WallCategory } from "./categories";

export default class TurnWall extends PolygonCollideable {
    constructor(side: TeamSide) {
        const InnerLeft = new Array(100).fill(0).map((_x, i, arr) => new Vector(
            mapSize.center.x + (fieldCircleRadius - 10) * Math.cos(Math.PI * (i) / (arr.length - 1) + (side === 'LEFT' ? -1 : 1) * Math.PI / 2),
            mapSize.center.y + (fieldCircleRadius - 10) * Math.sin(Math.PI * (i) / (arr.length - 1) + (side === 'LEFT' ? -1 : 1) * Math.PI / 2)
        ))

        const OuterLeft = new Array(100).fill(0).map((_x, i, arr) => new Vector(
            mapSize.center.x + (fieldCircleRadius + 10) * Math.cos(Math.PI * (arr.length - i - 1) / (arr.length - 1) + (side === 'LEFT' ? -1 : 1) * Math.PI / 2),
            mapSize.center.y + (fieldCircleRadius + 10) * Math.sin(Math.PI * (arr.length - i - 1) / (arr.length - 1) + (side === 'LEFT' ? -1 : 1) * Math.PI / 2)
        ))

        super(0, mapSize.center.setX(mapSize.center.x + (side === 'LEFT' ? 85 : -85)), [[
            ...InnerLeft,
            (side === 'LEFT' ? new Vector(InnerLeft[0].x - 2, mapSize.max.y) : new Vector(InnerLeft[0].x, 0)),
            ...OuterLeft.slice(0, OuterLeft.length - 1),
            (side === 'LEFT' ? new Vector(OuterLeft[0].x, 0) : new Vector(OuterLeft[OuterLeft.length - 1].x, mapSize.max.y))
        ]], {
            isStatic: true, collisionFilter: { category: WallCategory }
        })
    }
}