import { Champion, ChampionName, ChampionList } from './classes'

import { source } from './source'
import Player from '../classes/collideables/player'
import { World } from 'matter-js'
import { CircleCollideable, Collideable } from '../classes/collideables/physics'
import { Vector } from '../classes/math'
import { playerRadius } from '../globals'
import { TeamSide } from '../types'
import { AbilityProjectileCategory, PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityStunCategory } from '../classes/collideables/categories'
import Ring from '../classes/collideables/ring'

class Veigar extends Champion {
    _abilityQ: Collideable
    _abilityW: Collideable

    constructor(side: TeamSide, owner: Player) {
        super('Veigar', source.Veigar);
        this._spellQ = this.spells.Q
        this._spellW = this.spells.E

        this._abilityQ = new CircleCollideable(20, new Vector(0, 0), 10, {
            collisionFilter: {
                category: AbilityProjectileCategory,
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
            },
            plugin: {
                owner: owner,
                id: this._spellQ.id,
                duration: 1000,
                velocity: 10,
            }
        })
        this._abilityW = new Ring(5, new Vector(0, 0), playerRadius * 6, playerRadius, {
            isStatic: true,
            restitution: 0,
            collisionFilter: {
                category: AbilityStunCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: this._spellW.id,
                duration: 60000,
                velocity: 0,
            }
        })
    }

    getAbility(ability: 'Q' | 'W'): Collideable {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    return this._abilityQ
                case 'W':
                    return this._abilityW
                default:
                    break;
            }
        return null
    }
}


class Lux extends Champion {
    _abilityQ: Collideable
    _abilityW: Collideable

    constructor(side: TeamSide, owner: Player) {
        super('Lux', source.Lux);

        this._abilityQ = new CircleCollideable(10, new Vector(0, 0), 5, {
            plugin: {
                owner: owner,
            }
        })
        this._abilityW = new CircleCollideable(10, new Vector(0, 0), playerRadius * 4, {
            isStatic: true,
            collisionFilter: {

            },
            plugin: {
                owner: owner,
            }
        })
    }
}


export const champions: ChampionList = {
    'Veigar': (side: TeamSide, owner: Player) => new Veigar(side, owner),
    'Lux': (side: TeamSide, owner: Player) => new Lux(side, owner),
}