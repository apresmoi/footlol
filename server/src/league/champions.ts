import { Champion, ChampionList, ChampionSpell } from './classes'

import { source } from './source'
import Player from '../classes/collideables/player'
import { CircleCollideable, Collideable } from '../classes/collideables/physics'
import { Vector } from '../classes/math'
import { playerRadius } from '../globals'
import { TeamSide } from '../types'
import { AbilityProjectileCategory, PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityStunCategory, WallCategory } from '../classes/collideables/categories'
import Ring from '../classes/collideables/ring'
import { AsheQ, AsheW } from './abilities'
import { deepCopy } from '../utilities/objects'

class Veigar extends Champion {
    constructor(side: TeamSide, owner: Player) {
        super('Veigar', source.Veigar, owner);
        this.spells.Q = { ...this.spells.Q, cooldown: 0 }
        this.spells.W = { ...this.spells.E, cooldown: 0 }
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    getAbility(ability: 'Q' | 'W'): Collideable {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    const abilityQ = new CircleCollideable(20, new Vector(0, 0), 10, {
                        collisionFilter: {
                            category: AbilityProjectileCategory,
                            mask: this._owner._side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
                        },
                        plugin: {
                            owner: this._owner,
                            id: this._spellQ.id,
                            duration: 250,
                            velocity: 15,
                        }
                    })
                    abilityQ._body.plugin.drawer = abilityQ
                    return abilityQ
                case 'W':
                    const abilityW = new Ring(5, new Vector(0, 0), playerRadius * 6, playerRadius, {
                        isStatic: true,
                        restitution: 0,
                        collisionFilter: {
                            category: AbilityStunCategory,
                            mask: (this._owner._side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
                        },
                        plugin: {
                            owner: this._owner,
                            id: this._spellW.id,
                            duration: 3000,
                            effectDuration: 1500,
                            velocity: 0,
                        }
                    })
                    abilityW._body.plugin.drawer = abilityW
                    return abilityW
                default:
                    break;
            }
        return null
    }
}


class Ashe extends Champion {
    _owner: Player
    _abilityQ: Collideable
    _abilityW: Collideable

    constructor(side: TeamSide, owner: Player) {
        super('Ashe', source.Ashe, owner);
        this.spells.Q = deepCopy({ ...this.spells.W, cooldown: 1 })
        this.spells.W = deepCopy({ ...this.spells.R, cooldown: 1 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    getAbility(ability: 'Q' | 'W'): Collideable {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    return new AsheQ(this._spellQ, this._owner._side, this._owner)
                case 'W':
                    return new AsheW(this._spellW, this._owner._side, this._owner)
                default:
                    break;
            }
        return null
    }
}


export const champions: ChampionList = {
    'Ashe': (side: TeamSide, owner: Player) => new Ashe(side, owner),
    'Veigar': (side: TeamSide, owner: Player) => new Veigar(side, owner),
}