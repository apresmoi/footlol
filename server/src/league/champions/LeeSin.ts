import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import { Collideable, CircleCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityEffectCategory } from '../../classes/collideables/categories';
import { playerRadius, DEBUG, ballRadius } from '../../globals';

export default class LeeSin extends Champion {
    _owner: Player
    _abilityQ: Collideable
    _abilityQTarget: Collideable
    _abilityQTimeout: NodeJS.Timeout
    _abilityW: Collideable

    constructor(side: TeamSide, owner: Player) {
        super('LeeSin', source.LeeSin, owner);
        this.spells.Q = deepCopy({ ...this.spells.Q, cooldown: DEBUG ? 0 : 5 })
        this.spells.W = deepCopy({ ...this.spells.R, cooldown: DEBUG ? 0 : 15 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    getAbility(ability: 'Q' | 'W'): Collideable {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    if (!this._abilityQTarget) {
                        return new LeeSinQ(this._spellQ, this._owner._side, this._owner, (target) => {
                            this.clearCooldown('Q');
                            this._abilityQTarget = target;
                            this._abilityQTimeout = setTimeout(() => {
                                this._abilityQTarget = null;
                                this.setCooldown('Q');
                            }, 3000);
                        })
                    } else {
                        clearTimeout(this._abilityQTimeout)
                        const radius = this._abilityQTarget._body.plugin.owner instanceof Player ? playerRadius : ballRadius
                        const current = this._owner._body.plugin.owner.getPosition()
                        const distance = this._abilityQTarget.getPosition().substract(current)
                        this._owner._body.plugin.owner.setPosition(current.add(distance.substract(distance.normalize().multiply(radius * 2 + 5))))
                        this._abilityQTarget = null;
                        return null;
                    }
                case 'W':
                    return new LeeSinW(this._spellW, this._owner._side, this._owner)
                default:
                    break;
            }
        return null
    }
}


export class LeeSinQ extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player, targetAdquired: (target: Collideable) => void) {
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
                duration: 350,
                velocity: 14,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor) {
                        targetAdquired(target)
                        this._expired = true
                        this.dematerialize()
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }
}

export class LeeSinW extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(999999, new Vector(0, 0), playerRadius * 2, {
            restitution: 0,
            collisionFilter: {
                category: AbilityEffectCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            mass: 999999999,
            inertia: 999999999,
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 500,
                velocity: 0,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor) {
                        const velocity = target.getPosition().substract(this._body.plugin.owner.getPosition()).normalize().multiply(20)
                        target._body.plugin.owner.setVelocity(velocity, 5)
                        this._expired = true
                        this.dematerialize()
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }
}
