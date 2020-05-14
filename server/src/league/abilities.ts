import Cone from "../classes/collideables/cone";
import { Vector } from "../classes/math";
import { TeamSide } from "../types";
import Player from "../classes/collideables/player";
import { ChampionSpell } from "./classes";
import { AbilityProjectileCategory, PlayerRightSideCategory, PlayerLeftSideCategory, AbilityStunCategory } from "../classes/collideables/categories";
import { Body, World } from "matter-js";
import { CircleCollideable } from "../classes/collideables/physics";


export class AsheQ extends Cone {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(20, new Vector(0, 0), 50, Math.PI * 3 / 4, {
            collisionFilter: {
                category: AbilityProjectileCategory,
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
            },
            restitution: 0,
            mass: 99999999999,
            inertia: 99999999999,
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 500,
                velocity: 6,
            }
        })
        this._body.plugin.drawer = this
    }

    setVelocity(velocity: Vector, angularVelocity: number = 0): void {
        super.setVelocity(velocity, angularVelocity)
    }

    _scale = new Vector(1, 1)
    update(dt: number) {
        const f = dt / 2000
        Body.scale(this._body, 1 / this._scale.x, 1 / this._scale.y)
        this._scale = this._scale.add(new Vector(f, f))
        Body.scale(this._body, this._scale.x, this._scale.y)
        super.update(dt)
    }
}

export class AsheW extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(99999999, new Vector(0, 0), 25, {
            collisionFilter: {
                category: AbilityStunCategory,
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
            },
            mass: 99999999,
            inertia: 99999999,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 10000,
                velocity: 10,
                effectDuration: 2500,
                handleCollision: () => {
                    this._expired = true
                    this.dematerialize()
                }
            }
        })

        this._body.plugin.drawer = this
    }
}