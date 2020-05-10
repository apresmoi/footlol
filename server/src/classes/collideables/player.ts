import { CircleCollideable, CompoundCollideable } from "./physics";
import { playerRadius, playerActionRadius } from "../../globals";
import { Vector } from "../math";
import { Champion, ChampionName } from "../../league/classes";
import { champions } from "../../league/champions";
import { Body } from "matter-js";
import Ball from "./ball";
import { TeamSide } from "../../types";

export const PlayerCategory = 0x0004
export const PlayerActionCategory = 0x0016
export default class Player extends CompoundCollideable {
    _id: string
    _name: string
    _champion: Champion
    _side: TeamSide

    _kickTimeout: NodeJS.Timeout
    _kicking: boolean = false
    _canKick: boolean = false

    _physicalBody: CircleCollideable
    _sensorBody: CircleCollideable

    constructor(id: string, name: string, championName: ChampionName, position: Vector, side: TeamSide) {
        super(position)
        this._id = id;
        this._name = name;
        this._champion = champions[championName]
        this._side = side
        this._acceleration = 0.06

        this._physicalBody = new CircleCollideable(champions[championName].mass, position, playerRadius, {
            plugin: this
        });
        this._sensorBody = new CircleCollideable(0, position, playerActionRadius, {
            isSensor: true,
            plugin: this
        })

        this._body = CompoundCollideable.fromCollideables(position, [this._physicalBody, this._sensorBody], {
            mass: champions[championName].mass,
            restitution: 0.2,
            frictionStatic: 0,
            friction: 0.5,
            frictionAir: 0.07,
            collisionFilter: {
                category: PlayerCategory,
            },
            plugin: this
        })._body

    }

    checkSensor(body: Body): boolean {
        return body.id === this._sensorBody._body.id
    }

    allowPlayerToKick(canKick: boolean): boolean {
        return this._canKick = canKick
    }

    kick(ball: Ball): void {
        clearTimeout(this._kickTimeout)
        this._kicking = true;
        if (this._canKick) {
            const point = this.getPosition().add(
                this.getPosition().substract(ball.getPosition()).normalize().multiply(ball._body.circleRadius)//.rotate(Math.PI / 4)
            )
            const force = this.getPosition().substract(ball.getPosition()).normalize().multiply(this._acceleration)
            Body.applyForce(ball._body, point, force)
        }
        this._kickTimeout = setTimeout(() => {
            this._kicking = false;
        }, 100);
    }

    requestAbility(ability: 'Q' | 'W'): void {
        console.log("Ability " + ability)
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
            position: this.getPosition().serialize(),
            side: this._side,
            kicking: this._kicking
        }
    }
}