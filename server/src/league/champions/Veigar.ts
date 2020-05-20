import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import Ring from '../../classes/collideables/ring'
import { Collideable, CircleCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { AbilityProjectileCategory, PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityStunCategory } from '../../classes/collideables/categories';
import { playerRadius, DEBUG } from '../../globals';

export default class Veigar extends Champion {
    constructor(side: TeamSide, owner: Player) {
        super('Veigar', source.Veigar, owner);
        this.spells.Q = deepCopy({ ...this.spells.Q, cooldown: DEBUG ? 0 :  5 })
        this.spells.W = deepCopy({ ...this.spells.E, cooldown: DEBUG ? 0 :  15 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    async getAbility(ability: 'Q' | 'W'): Promise<Collideable> {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    return new VeigarQ(this._spellQ, this._owner._side, this._owner)
                case 'W':
                    return new VeigarW(this._spellW, this._owner._side, this._owner)
                default:
                    break;
            }
        return null
    }
}


export class VeigarQ extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(20, new Vector(0, 0), 10, {
            collisionFilter: {
                category: AbilityProjectileCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 250,
                velocity: 15,
            }
        })
        this._body.plugin.drawer = this
    }
}

export class VeigarW extends Ring {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(5, new Vector(0, 0), playerRadius * 6, playerRadius, {
            isStatic: true,
            restitution: 0,
            collisionFilter: {
                category: AbilityStunCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 3000,
                effectDuration: 1500,
                velocity: 0,
            }
        })
        const self = this
        this._body.plugin.drawer = self
        this._body.parts.forEach(part => {
            part.plugin.drawer = self
        })
    }
}