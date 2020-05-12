import { CircleCollideable, CompoundCollideable } from "./physics";
import { playerRadius, playerActionRadius } from "../../globals";
import { Vector } from "../math";
import { Champion, ChampionName } from "../../league/classes";
import { champions } from "../../league/champions";
import { Body, World } from "matter-js";
import Ball from "./ball";
import { TeamSide } from "../../types";
import { PlayerLeftSideCategory, PlayerRightSideCategory } from "./categories";

export default class Player extends CompoundCollideable {
    _id: string
    _name: string
    _champion: Champion
    _side: TeamSide

    _ready: boolean = false

    _kickTimeout: NodeJS.Timeout
    _kicking: boolean = false
    _canKick: boolean = false

    _physicalBody: CircleCollideable
    _sensorBody: CircleCollideable

    _force: number

    _facingVector: Vector

    constructor(id: string, name: string, championName: ChampionName, position: Vector, side: TeamSide) {
        super(position)
        this._id = id;
        this._name = name;
        if (championName) this._champion = champions[championName](side)
        this._side = side
        this._acceleration = 0.07
        this._ready = false

        const mass = this._champion?.hp / 10 || 50

        this._physicalBody = new CircleCollideable(mass, position, playerRadius, {
            plugin: this
        });
        this._sensorBody = new CircleCollideable(0, position, playerActionRadius, {
            isSensor: true,
            plugin: this
        })

        this._body = CompoundCollideable.fromCollideables(position, [this._physicalBody, this._sensorBody], {
            mass: mass,
            restitution: 0.2,
            frictionStatic: 0,
            friction: 0.5,
            frictionAir: 0.07,
            collisionFilter: {
                category: side === 'LEFT' ? PlayerLeftSideCategory : PlayerRightSideCategory,
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
            const force = this.getPosition().substract(ball.getPosition()).normalize().multiply(this._force)
            Body.applyForce(ball._body, point, force)
        }
        this._kickTimeout = setTimeout(() => {
            this._kicking = false;
        }, 100);
    }

    requestAbility(ability: 'Q' | 'W', world: World): void {
        this._champion.tryExecute(ability, this, world)
    }

    update() {
        if (this._direction.module()) {
            Body.applyForce(this._body, this._body.position, this._direction.multiply(this._acceleration));
        }
        super.update();
    }

    setReady(ready: boolean) {
        this._ready = ready
    }

    setChampion(championName: ChampionName) {
        this._champion = champions[championName](this._side)
        Body.setMass(this._body, this._champion.hp / 10)
        this._acceleration = this._champion.movespeed / 5000
        this._force = this._champion.attackdamage / 400
    }

    changeDirection(direction: Vector) {
        super.changeDirection(direction)
        if (direction.x !== 0 && direction.y !== 0) this._facingVector = direction
    }

    isReady() {
        return this._ready
    }

    serialize() {
        return {
            id: this._id,
            name: this._name,
            champion: this._champion ? this._champion.name : null,
            position: this.getPosition().serialize(),
            side: this._side,
            kicking: this._kicking,
            ready: this._ready
        }
    }
}