import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import Ball from '../../classes/collideables/ball'
import { Collideable, CircleCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityStunCategory, AbilityEffectCategory } from '../../classes/collideables/categories';
import { playerRadius, ballRadius, DEBUG } from '../../globals';
import VectorCollideable from '../../classes/collideables/vector'

export default class Amumu extends Champion {
    _owner: Player
    _abilityQ: Collideable
    _abilityW: Collideable

    constructor(side: TeamSide, owner: Player) {
        super('Amumu', source.Amumu, owner);
        this.spells.Q = deepCopy({ ...this.spells.Q, cooldown: DEBUG ? 0 :  5 })
        this.spells.W = deepCopy({ ...this.spells.R, cooldown: DEBUG ? 0 :  15 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    async getAbility(ability: 'Q' | 'W'): Promise<Collideable> {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    return new AmumuQ(this._spellQ, this._owner._side, this._owner)
                case 'W':
                    return new AmumuW(this._spellW, this._owner._side, this._owner)
                default:
                    break;
            }
        return null
    }
}

export class AmumuQ extends VectorCollideable {
    _target: Collideable
    _targetDistance: number = playerRadius

    _distanceToStopBeforeTarget(target: Collideable): number {
        if (target instanceof Player) return playerRadius * 2 + 2
        if (target instanceof Ball) return playerRadius + ballRadius + 2
        return playerRadius + target.getBounds().module() / 2 + 2
    }

    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(0, new Vector(0, 0), 10, {
            restitution: 0,
            isSensor: true,
            collisionFilter: {
                category: AbilityEffectCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 1000,
                effectDuration: 500,
                velocity: 7,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor && !this._target) {
                        this.setVelocity(new Vector(0, 0))
                        this._body.plugin.duration = 1200
                        const stunDuration = typeof this._body.plugin.effectDuration === 'number' ? this._body.plugin.effectDuration : 0
                        if (stunDuration > 0) {
                            target.setVelocity(new Vector(0, 0), 0)
                            target.setStun(stunDuration)
                            if (target instanceof Player || target instanceof Ball) {
                                target.applyStateFromAbility(spell.id, stunDuration)
                            }
                        }
                        this._target = target
                        this._targetDistance = this._distanceToStopBeforeTarget(target)
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }

    update(dt: number) {
        if (!this._target) return

        const owner = this._body.plugin.owner as Player
        const current = owner.getPosition()
        const targetPosition = this._target.getPosition()
        const toTarget = targetPosition.substract(current)
        const toTargetDistance = toTarget.module()
        const direction = toTargetDistance > 0 ? toTarget.normalize() : owner._facingVector.normalize()
        const desiredPosition = targetPosition.substract(direction.multiply(this._targetDistance))
        const remaining = desiredPosition.substract(current)
        const remainingDistance = remaining.module()

        if (remainingDistance <= 3) {
            owner.setPosition(desiredPosition)
            owner.setVelocity(new Vector(0, 0), 0)
            this._expired = true
            this.dematerialize()
            return
        }

        const step = Math.min(remainingDistance, Math.max(8, toTargetDistance * 0.35))
        const nextPosition = current.add(remaining.normalize().multiply(step))
        owner.setPosition(nextPosition)
        owner.setVelocity(new Vector(0, 0), 0)
    }
}

export class AmumuW extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(999999999, new Vector(0, 0), playerRadius * 8, {
            isStatic: true,
            restitution: 0,
            collisionFilter: {
                category: AbilityStunCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 2000,
                effectDuration: 2500,
                velocity: 0,
            }
        })
        this._body.plugin.drawer = this
    }
}
