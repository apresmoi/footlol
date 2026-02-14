import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import { Collideable, CircleCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { AbilityProjectileCategory, PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityStunCategory } from '../../classes/collideables/categories';
import { DEBUG } from '../../globals';

export default class Ashe extends Champion {
    _owner: Player
    _abilityQ: Collideable
    _abilityW: Collideable

    constructor(side: TeamSide, owner: Player) {
        super('Ashe', source.Ashe, owner);
        this.spells.Q = deepCopy({ ...this.spells.W, cooldown: DEBUG ? 0 :  5 })
        this.spells.W = deepCopy({ ...this.spells.R, cooldown: DEBUG ? 0 :  15 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    async getAbility(ability: 'Q' | 'W', dispatcher: (collideable: Collideable) => void): Promise<Collideable> {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    const facingVector = this._owner._facingVector.normalize()
                    const spreadAngles = [-0.24, -0.16, -0.08, 0, 0.08, 0.16, 0.24]
                    const baseSpeed = 7.4
                    const baseOrigin = this._owner.getPosition()

                    spreadAngles.forEach((angle) => {
                        // Use explicit 2D rotation here (y-down world) to keep the volley cone aligned.
                        const direction = new Vector(
                            facingVector.x * Math.cos(angle) - facingVector.y * Math.sin(angle),
                            facingVector.x * Math.sin(angle) + facingVector.y * Math.cos(angle)
                        ).normalize()
                        const origin = baseOrigin
                        dispatcher(new AsheQ(this._spellQ, this._owner._side, this._owner, origin, direction.multiply(baseSpeed)))
                    })
                    return null
                case 'W':
                    return new AsheW(this._spellW, this._owner._side, this._owner)
                default:
                    break;
            }
        return null
    }
}

export class AsheQ extends CircleCollideable {
    _travelDirection: Vector

    constructor(spell: ChampionSpell, side: TeamSide, owner: Player, position: Vector, velocity: Vector) {
        super(4, position, 7, {
            isSensor: true,
            collisionFilter: {
                category: AbilityProjectileCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 620,
                velocity: 0,
                handleCollision: (target: Collideable) => {
                    if (this._expired || !target || target._body.isSensor) return
                    target.setSlow(1400, 0.5)

                    this._expired = true
                    this.dematerialize()
                }
            }
        })
        this._body.plugin.drawer = this
        this._travelDirection = velocity.normalize()
        this.setVelocity(velocity)
    }

    serialize(): any {
        return {
            ...super.serialize(),
            // Keep render direction perfectly aligned with projectile trajectory.
            direction: this._travelDirection.serialize()
        }
    }
}

export class AsheW extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(99999999, new Vector(0, 0), 25, {
            isSensor: true,
            collisionFilter: {
                category: AbilityStunCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
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
                handleCollision: (target) => {
                    this._expired = true
                    this.dematerialize()
                }
            }
        })

        this._body.plugin.drawer = this
    }
}
