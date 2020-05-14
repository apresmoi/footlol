import { Champion, ChampionList, ChampionSpell } from './classes'

import { source } from './source'
import Player from '../classes/collideables/player'
import { CircleCollideable, Collideable } from '../classes/collideables/physics'
import { Vector } from '../classes/math'
import { playerRadius } from '../globals'
import { TeamSide } from '../types'
import { AbilityProjectileCategory, PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityStunCategory, WallCategory } from '../classes/collideables/categories'
import Ring from '../classes/collideables/ring'
import { AsheQ, AsheW, VeigarQ, VeigarW, AmumuW, AmumuQ, LeeSinQ, LeeSinW } from './abilities'
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
                    return new VeigarQ(this._spellQ, this._owner._side, this._owner)
                case 'W':
                    return new VeigarW(this._spellW, this._owner._side, this._owner)
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


class Amumu extends Champion {
    _owner: Player
    _abilityQ: Collideable
    _abilityW: Collideable

    constructor(side: TeamSide, owner: Player) {
        super('Amumu', source.Amumu, owner);
        this.spells.Q = deepCopy({ ...this.spells.Q, cooldown: 1 })
        this.spells.W = deepCopy({ ...this.spells.R, cooldown: 1 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    getAbility(ability: 'Q' | 'W'): Collideable {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    return new AmumuQ(this._spellQ, this._owner._side, this._owner)
                case 'W':
                    return new AmumuW(this._spellW, this._owner._side, this._owner)
                default:
                    break;
            }
        return null
    }
}


class LeeSin extends Champion {
    _owner: Player
    _abilityQ: Collideable
    _abilityW: Collideable

    constructor(side: TeamSide, owner: Player) {
        super('LeeSin', source.LeeSin, owner);
        this.spells.Q = deepCopy({ ...this.spells.Q, cooldown: 1 })
        this.spells.W = deepCopy({ ...this.spells.R, cooldown: 1 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    getAbility(ability: 'Q' | 'W'): Collideable {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    return new LeeSinQ(this._spellQ, this._owner._side, this._owner)
                case 'W':
                    return new LeeSinW(this._spellW, this._owner._side, this._owner)
                default:
                    break;
            }
        return null
    }
}

export const champions: ChampionList = {
    'Ashe': (side: TeamSide, owner: Player) => new Ashe(side, owner),
    'Veigar': (side: TeamSide, owner: Player) => new Veigar(side, owner),
    'Amumu': (side: TeamSide, owner: Player) => new Amumu(side, owner),
    'LeeSin': (side: TeamSide, owner: Player) => new LeeSin(side, owner),
}