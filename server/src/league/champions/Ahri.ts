import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import { Collideable, CircleCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityStunCategory, AbilityEffectCategory } from '../../classes/collideables/categories';
import { playerRadius, DEBUG } from '../../globals';

export default class Ahri extends Champion {
    constructor(side: TeamSide, owner: Player) {
        super('Ahri', source.Ahri, owner);
        this.spells.Q = deepCopy({ ...this.spells.W, cooldown: DEBUG ? 0 : 5 })
        this.spells.W = deepCopy({ ...this.spells.R, cooldown: DEBUG ? 0 : 20 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    _wUses = 0
    async getAbility(ability: 'Q' | 'W'): Promise<Collideable> {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    return new AhriQ(this._spellW, this._owner._side, this._owner)
                case 'W':
                    return new Promise((resolve, _reject) => {
                        const facingVector = (this._owner as Player)._facingVector.normalize()
                        const targetPosition = this._owner.getPosition().add(facingVector.multiply(200))
                        let runs = 0
                        this._wUses++;
                        if (this._wUses !== 3) {
                            this._tsW = null;
                        }
                        const interval = setInterval(() => {
                            const current = this._owner.getPosition()
                            const maxMov = targetPosition.substract(current)
                            const distance = maxMov.module()
                            if (distance > 10 && runs < 100) {
                                runs++;

                                const mov = maxMov.normalize().multiply(8)
                                if (Math.abs(mov.x) > Math.abs(maxMov.x)) mov.setX(maxMov.x)
                                if (Math.abs(mov.y) > Math.abs(maxMov.y)) mov.setX(maxMov.y)

                                this._owner.setPosition(
                                    current
                                        .setX(current.x + mov.x)
                                        .setY(current.y + mov.y)
                                )
                            } else {
                                clearInterval(interval)
                                this._owner.setPosition(targetPosition)
                                resolve(null)
                            }
                        }, 10);
                    })
                default:
                    break;
            }
        return null
    }
}

export class AhriQ extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(0, new Vector(0, 0), playerRadius / 2, {
            isSensor: true,
            collisionFilter: {
                category: AbilityEffectCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 500,
                velocity: 10,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor) {
                        target.setStun(1500)
                        let iterations = 0
                        const interval = setInterval(() => {
                            const current = target.getPosition()
                            const ownerPosition = this._body.plugin.owner.getPosition()
                            const direction = ownerPosition.substract(current).normalize()
                            if (target.getPosition().substract(ownerPosition).module() < playerRadius * 2) {
                                clearInterval(interval)
                            }
                            else if (iterations < 1500) {
                                iterations += 20
                                target.setPosition(target.getPosition().add(direction.multiply(1)))
                            } else {
                                clearInterval(interval)
                            }
                        }, 20)
                        setTimeout(() => {
                            this._expired = true
                            this.dematerialize()
                        }, 1500);
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }
}
