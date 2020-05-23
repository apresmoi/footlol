import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import { Collideable, CircleCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityStunCategory, AbilityEffectCategory, AbilityProjectileCategory } from '../../classes/collideables/categories';
import { DEBUG } from '../../globals';

export default class Lucian extends Champion {
    constructor(side: TeamSide, owner: Player) {
        super('Lucian', source.Lucian, owner);
        this.spells.Q = deepCopy({ ...this.spells.E, cooldown: DEBUG ? 0 : 5 })
        this.spells.W = deepCopy({ ...this.spells.R, cooldown: DEBUG ? 0 : 20 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    async getAbility(ability: 'Q' | 'W', dispatcher: (Collideable: Collideable) => void): Promise<Collideable> {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    return new Promise((resolve, _reject) => {
                        const facingVector = (this._owner as Player)._facingVector.normalize()
                        const targetPosition = this._owner.getPosition().add(facingVector.multiply(150))
                        let runs = 0
                        const interval = setInterval(() => {
                            const current = this._owner.getPosition()
                            const maxMov = targetPosition.substract(current)
                            const distance = maxMov.module()
                            if (distance > 10 && runs < 50) {
                                runs++;

                                const mov = maxMov.normalize().multiply(5)
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
                case 'W':
                    return new Promise((resolve, _reject) => {
                        const facingVector = (this._owner as Player)._facingVector.normalize()
                        let shoots = 20
                        const interval = setInterval(() => {
                            this._owner._facingVector = facingVector
                            const origin = this._owner.getPosition()
                            dispatcher(new LucianQ(this.spells.Q, this._owner._side, this._owner,
                                origin.add(facingVector.normalize().rotate(Math.PI / 2).multiply((shoots % 2 ? 1 : -1) * 10))
                            ))
                            shoots--
                            if (shoots === 0) {
                                clearInterval(interval)
                                resolve(null)
                            }
                        }, 100);
                    })
                default:
                    break;
            }
        return null
    }
}

export class LucianQ extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player, position: Vector) {
        super(5, position, 5, {
            collisionFilter: {
                category: AbilityProjectileCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 500,
                velocity: 15,
            }
        })
        this._body.plugin.drawer = this
    }
}
