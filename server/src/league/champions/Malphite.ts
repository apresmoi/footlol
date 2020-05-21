import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import { Collideable, CircleCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityStunCategory, AbilityEffectCategory } from '../../classes/collideables/categories';
import { playerRadius, DEBUG } from '../../globals';

export default class Malphite extends Champion {
    constructor(side: TeamSide, owner: Player) {
        super('Malphite', source.Malphite, owner);
        this.spells.Q = deepCopy({ ...this.spells.W, cooldown: DEBUG ? 0 : 5 })
        this.spells.W = deepCopy({ ...this.spells.R, cooldown: DEBUG ? 0 : 15 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    async getAbility(ability: 'Q' | 'W'): Promise<Collideable> {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    return new MalphiteQ(this._spellW, this._owner._side, this._owner)
                case 'W':
                    return new Promise((resolve, _reject) => {
                        const facingVector = (this._owner as Player)._facingVector.normalize()
                        const targetPosition = this._owner.getPosition().add(facingVector.multiply(300))
                        let runs = 0
                        const interval = setInterval(() => {
                            const current = this._owner.getPosition()
                            const distance = targetPosition.substract(current).module()
                            if (distance > 10 && runs < 100) {
                                runs++;
                                this._owner.setPosition(
                                    current
                                        .setX(current.x + (targetPosition.x - current.x) / 10)
                                        .setY(current.y + (targetPosition.y - current.y) / 10)
                                )
                            } else {
                                clearInterval(interval)
                                this._owner.setPosition(targetPosition)
                                this._owner.setStun(200)
                                resolve(new MalphiteW(this._spellW, this._owner._side, this._owner))
                            }
                        }, 10);
                    })
                default:
                    break;
            }
        return null
    }
}

export class MalphiteQ extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(999999999, new Vector(0, 0), playerRadius * 3, {
            isStatic: true,
            restitution: 0,
            collisionFilter: {
                category: AbilityStunCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 250,
                effectDuration: 500,
                velocity: 0,
            }
        })
        this._body.plugin.drawer = this
    }
}

export class MalphiteW extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(999999, new Vector(0, 0), playerRadius * 4, {
            restitution: 0,
            isSensor: true,
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
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }
}