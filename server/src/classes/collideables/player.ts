import { CircleCollideable, CompoundCollideable, Collideable } from "./physics";
import { playerRadius, playerActionRadius, mapSize } from "../../globals";
import { Vector } from "../math";
import { Champion, ChampionName } from "../../league/classes";
import { champions } from "../../league/champions";
import { Body, World } from "matter-js";
import Ball from "./ball";
import { TeamSide } from "../../types";
import { PlayerLeftSideCategory, PlayerRightSideCategory, WallCategory, GoalCategory, BallCategory } from "./categories";

export default class Player extends CompoundCollideable {
    _id: string
    _name: string
    _champion: Champion
    _side: TeamSide
    _admin: boolean = false

    _ready: boolean = false

    _kickTimeout: NodeJS.Timeout
    _kicking: boolean = false
    _canKick: boolean = false

    _physicalBody: CircleCollideable
    _sensorBody: CircleCollideable

    _force: number

    _facingVector: Vector

    _visible: boolean

    constructor(id: string, name: string, championName: ChampionName, position: Vector, side: TeamSide, admin: boolean) {
        super(position)
        this._id = id;
        this._name = name;
        if (championName) this._champion = champions[championName](side, this)
        this._side = side
        this._acceleration = 0.07
        this._ready = false
        this._visible = true
        this._admin = admin

        const mass = this._champion?.hp / 10 || 50

        this._facingVector = side === 'LEFT' ? new Vector(1, 0) : new Vector(-1, 0)

        this._physicalBody = new CircleCollideable(mass, position, playerRadius, {
            plugin: {
                owner: this,
            },
        });
        this._sensorBody = new CircleCollideable(0, position, playerActionRadius, {
            isSensor: true,
            plugin: {
                owner: this,
            }
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
            plugin: {
                owner: this,
            }
        })._body

        this._backupCollision = this._body.collisionFilter
        this._movementBounds = [new Vector(0, 0), new Vector(mapSize.width, mapSize.height)]
    }

    reinit = (position: Vector): Player => {
        const copy = new Player(this._id, this._name, this._champion.name, position, this._side, this._admin)
        copy._body.plugin.owner = this
        copy._body.parts.forEach(part => { part.plugin.owner = this })
        return copy
    }

    _backupCollision
    disableCollisions(disabled: boolean): void {
        if (disabled) {
            this._body.collisionFilter = {
                mask: WallCategory
            }
        }
        else {
            this._body.collisionFilter = this._backupCollision
        }
    }

    handleCollision(target: Collideable): void {
        this.makeVisible()
        super.handleCollision(target)
    }

    checkSensor(body: Body): boolean {
        return body.id === this._sensorBody._body.id
    }

    allowPlayerToKick(canKick: boolean): boolean {
        return this._canKick = canKick
    }

    kick(ball: Ball): boolean {
        clearTimeout(this._kickTimeout)
        this._kicking = true;
        this._kickTimeout = setTimeout(() => {
            this._kicking = false;
        }, 100);
        if (this._canKick) {
            const point = this.getPosition().add(
                this.getPosition().substract(ball.getPosition()).normalize().multiply(ball._body.circleRadius)//.rotate(Math.PI / 4)
            )
            const force = this.getPosition().substract(ball.getPosition()).normalize().multiply(this._force)
            Body.applyForce(ball._body, point, force)
            return true
        }
        return false
    }

    async requestAbility(ability: 'Q' | 'W', dispatcher: (collideable: Collideable) => void): Promise<Collideable> {
        return this._champion.getAbility(ability, dispatcher)
    }

    update(dt: number) {
        if (this._direction.module()) {
            Body.applyForce(this._body, this._body.position, this._direction.normalize().multiply(this._acceleration));
        }
        super.update(dt);
    }

    setReady(ready: boolean) {
        this._ready = ready
    }

    setChampion(championName: ChampionName) {
        this._champion = champions[championName](this._side, this)
        Body.setMass(this._body, this._champion.hp / 10)
        this._acceleration = this._champion.movespeed / 5000
        this._force = this._champion.attackdamage / 400
    }

    setSide(side: TeamSide) {
        this._side = side
        this._facingVector = side === 'LEFT' ? new Vector(1, 0) : new Vector(-1, 0)
        this._body.collisionFilter = {
            category: side === 'LEFT' ? PlayerLeftSideCategory : PlayerRightSideCategory,
        }
    }

    changeDirection(direction: Vector) {
        super.changeDirection(direction)
        if (direction.x !== 0 || direction.y !== 0) this._facingVector = direction
    }

    isReady() {
        return this._ready
    }

    makeInvisible() {
        this._visible = false
    }

    makeVisible() {
        this._visible = true
    }

    serialize() {
        return {
            id: this._id,
            name: this._name,
            champion: this._champion ? this._champion.name : null,
            position: this.getPosition().serialize(),
            side: this._side,
            kicking: this._kicking,
            ready: this._ready,
            cooldown: this._champion ? this._champion.getCooldowns() : { W: 0, Q: 0 },
            visible: this._visible,
            admin: this._admin,
            direction: this._direction.serialize()
        }
    }
}