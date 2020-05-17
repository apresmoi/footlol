import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import { Collideable, RectCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityProjectileCategory } from '../../classes/collideables/categories';
import { playerRadius } from '../../globals';


export default class Garen extends Champion {
    _owner: Player
    _abilityQ: Collideable
    _abilityW: Collideable

    constructor(side: TeamSide, owner: Player) {
        super('Garen', source.Garen, owner);
        this.spells.Q = deepCopy({ ...this.spells.Q, cooldown: 5 })
        this.spells.W = deepCopy({ ...this.spells.E, cooldown: 15 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    getAbility(ability: 'Q' | 'W'): Collideable {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    let acceleration = this._owner._acceleration
                    this._owner._acceleration = acceleration * 2
                    setTimeout(() => {
                        this._owner._acceleration = acceleration
                    }, 1500);
                    return null
                case 'W':
                    return new GarenW(this._spellW, this._owner._side, this._owner)
                default:
                    break;
            }
        return null
    }
}

export class GarenW extends RectCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(100, new Vector(0, 0), playerRadius / 2, playerRadius * 6, 0, {
            // isStatic: true,
            collisionFilter: {
                category: AbilityProjectileCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 4000,
                velocity: 0,
                angularVelocity: Math.PI / 10
            },
        })
        this._body.plugin.drawer = this
    }

    update(dt: number) {
        this.setPosition(this._body.plugin.owner.getPosition())
        this.setVelocity(this._body.plugin.owner.getVelocity(), this._body.plugin.angularVelocity)
    }
}


