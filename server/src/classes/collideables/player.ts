import { CircleCollideable } from "./physics";
import { playerRadius } from "../../globals";
import { Vector } from "../math";
import { Champion, ChampionName } from "../../league/classes";
import { champions } from "../../league/champions";

export default class Player extends CircleCollideable {
    _id: string
    _name: string
    _champion: Champion

    constructor(id: string, name: string, championName: ChampionName, position: Vector) {
        super(champions[championName].mass, position, playerRadius);
        this._id = id;
        this._name = name;
        this._champion = champions[championName]
        this._friction = 2
    }

    serialize() {
        return {
            id: this._id,
            name: this._name,
            champion: this._champion.name,
            position: this._position.serialize()
        }
    }
}