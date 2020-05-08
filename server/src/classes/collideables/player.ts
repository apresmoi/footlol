import { CircleCollideable } from "./physics";
import { playerRadius } from "../../globals";
import { Vector } from "../math";
import { Champion, ChampionName } from "../../league/classes";
import { champions } from "../../league/champions";
import { Body } from "matter-js";

export default class Player extends CircleCollideable {
    _id: string
    _name: string
    _champion: Champion

    constructor(id: string, name: string, championName: ChampionName, position: Vector) {
        super(champions[championName].mass, position, playerRadius, {
            restitution: 0.2,
            frictionStatic: 0,
            friction: 0.5,
            frictionAir: 0.07,
        });
        this._id = id;
        this._name = name;
        this._champion = champions[championName]
        this._acceleration = 0.06
    }

    update() {
        if (this._direction.module()) {
            Body.applyForce(this._body, this._body.position, this._direction.multiply(this._acceleration));
        }
        super.update();
    }

    serialize() {
        return {
            id: this._id,
            name: this._name,
            champion: this._champion.name,
            position: this.getPosition().serialize()
        }
    }
}