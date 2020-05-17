import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import { Collideable, CircleCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { PlayerRightSideCategory, PlayerLeftSideCategory, AbilityEffectCategory } from '../../classes/collideables/categories';
import { playerRadius } from '../../globals';
import Ball from '../../classes/collideables/ball';

export default class Shaco extends Champion {
    _owner: Player
    _abilityQ: Collideable
    _abilityW: Collideable

    constructor(side: TeamSide, owner: Player) {
        super('Shaco', source.Shaco, owner);
        this.spells.Q = deepCopy({ ...this.spells.Q, cooldown: 5 })
        this.spells.W = deepCopy({ ...this.spells.W, cooldown: 15 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    getAbility(ability: 'Q' | 'W'): Collideable {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    console.log("invisible")
                    this._owner.makeInvisible()
                    setTimeout(() => {
                        console.log("visible")
                        this._owner.makeVisible()
                    }, 10000);
                    return null
                case 'W':
                    return new ShacoW(this._spellW, this._owner._side, this._owner)
                default:
                    break;
            }
        return null
    }
}

export class ShacoW extends CircleCollideable {
    _visible: boolean = false
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(0, new Vector(0, 0), playerRadius * 4, {
            isStatic: true,
            isSensor: true,
            collisionFilter: {
                category: AbilityEffectCategory,
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 30000,
                velocity: 0,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor && !(target._body.plugin.owner instanceof Ball)) {
                        this._visible = true
                        const current = target.getPosition()
                        const direction = current.substract(this.getPosition()).normalize()
                        target.setStun(1500)
                        let iterations = 0
                        const interval = setInterval(() => {
                            if (iterations < 1500) {
                                iterations += 50
                                target.setPosition(target.getPosition().add(direction.multiply(1).setY(Math.random() * 4 - 2)))
                            } else {
                                clearInterval(interval)
                            }
                        }, 50)
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

    serialize(): any {
        return {
            type: 'circle',
            position: this.getPosition().serialize(),
            angle: this.getAngle(),
            radius: this._body.circleRadius,
            direction: this.getVelocity().director(),
            visible: this._visible
        }
    }
}

