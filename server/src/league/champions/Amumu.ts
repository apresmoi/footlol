import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import { Collideable, CircleCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityStunCategory, AbilityEffectCategory } from '../../classes/collideables/categories';
import { playerRadius, DEBUG } from '../../globals';
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

    getAbility(ability: 'Q' | 'W'): Collideable {
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
    _targetPosition: Vector
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
                velocity: 7,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor && !this._targetPosition) {
                        this.setVelocity(new Vector(0, 0))
                        this._body.plugin.duration = 1000
                        const current = this._body.plugin.owner.getPosition()
                        const distance = target.getPosition().substract(current)
                        this._targetPosition = current.add(distance.substract(distance.normalize().multiply(target.getBounds().module())))
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }

    update(dt: number) {
        if (this._targetPosition) {
            const current = this._body.plugin.owner.getPosition()
            const distance = this._targetPosition.substract(current).module()
            if (distance > 0) {
                this._body.plugin.owner.setPosition(
                    current
                        .setX(current.x + (this._targetPosition.x - current.x) / 10)
                        .setY(current.y + (this._targetPosition.y - current.y) / 10)
                )

            } else {
                this._expired = true
                this.dematerialize()
            }
        }
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


