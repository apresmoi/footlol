import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import { Collideable, CircleCollideable, RectCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityStunCategory, WallCategory } from '../../classes/collideables/categories';
import { playerRadius } from '../../globals';
import { Body } from 'matter-js';

export default class Anivia extends Champion {
    constructor(side: TeamSide, owner: Player) {
        super('Anivia', source.Anivia, owner);
        this.spells.Q = deepCopy({ ...this.spells.Q, cooldown: 5 })
        this.spells.W = deepCopy({ ...this.spells.W, cooldown: 15 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    getAbility(ability: 'Q' | 'W'): Collideable {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    return new AniviaQ(this._spellQ, this._owner._side, this._owner)
                case 'W':
                    return new AniviaW(this._spellW, this._owner._side, this._owner)
                default:
                    break;
            }
        return null
    }
}

export class AniviaQ extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(10, new Vector(0, 0), 25, {
            isSensor: true,
            collisionFilter: {
                category: AbilityStunCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 1200,
                velocity: 7,
                effectDuration: 500,
                handleCollision: (target) => {
                    this._expired = true
                    this.dematerialize()
                }
            }
        })
        this._body.plugin.drawer = this
    }
}


export class AniviaW extends RectCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(20, new Vector(0, 0), playerRadius, playerRadius * 10, 0, {
            isStatic: true,
            collisionFilter: {
                category: WallCategory,
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 3500,
                velocity: 0,
            }
        })
        this._body.plugin.drawer = this
    }

    setPosition(position: Vector) {
        const facingVector = (this._body.plugin.owner as Player)._facingVector.normalize()
        const newPosition = position.add(facingVector.multiply(300))
        Body.setAngle(this._body, facingVector.angle());
        super.setPosition(newPosition)
    }
}