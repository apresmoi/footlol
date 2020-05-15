import { Champion, ChampionList } from './classes'

import { source } from './source'
import Player from '../classes/collideables/player'
import { Collideable } from '../classes/collideables/physics'
import { TeamSide } from '../types'
import { AsheQ, AsheW, VeigarQ, VeigarW, AmumuW, AmumuQ, LeeSinQ, LeeSinW, ThreshQ, ThreshW, ShacoW, GarenW, AniviaQ, AniviaW, YasuoQ, YasuoW, MalphiteW, MalphiteQ } from './abilities'
import { deepCopy } from '../utilities/objects'

class Veigar extends Champion {
    constructor(side: TeamSide, owner: Player) {
        super('Veigar', source.Veigar, owner);
        this.spells.Q = deepCopy({ ...this.spells.Q, cooldown: 5 })
        this.spells.W = deepCopy({ ...this.spells.E, cooldown: 15 })
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
        this.spells.Q = deepCopy({ ...this.spells.W, cooldown: 5 })
        this.spells.W = deepCopy({ ...this.spells.R, cooldown: 15 })
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
        this.spells.Q = deepCopy({ ...this.spells.Q, cooldown: 5 })
        this.spells.W = deepCopy({ ...this.spells.R, cooldown: 15 })
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
        this.spells.Q = deepCopy({ ...this.spells.Q, cooldown: 5 })
        this.spells.W = deepCopy({ ...this.spells.R, cooldown: 15 })
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



class Thresh extends Champion {
    _owner: Player
    _abilityQ: Collideable
    _abilityW: Collideable

    constructor(side: TeamSide, owner: Player) {
        super('Thresh', source.Thresh, owner);
        this.spells.Q = deepCopy({ ...this.spells.Q, cooldown: 5 })
        this.spells.W = deepCopy({ ...this.spells.W, cooldown: 15 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    getAbility(ability: 'Q' | 'W'): Collideable {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    return new ThreshQ(this._spellQ, this._owner._side, this._owner)
                case 'W':
                    return new ThreshW(this._spellW, this._owner._side, this._owner)
                default:
                    break;
            }
        return null
    }
}


class Shaco extends Champion {
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


class Garen extends Champion {
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


class Anivia extends Champion {
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


class Yasuo extends Champion {
    constructor(side: TeamSide, owner: Player) {
        super('Yasuo', source.Yasuo, owner);
        this.spells.Q = deepCopy({ ...this.spells.E, cooldown: 2 })
        this.spells.W = deepCopy({ ...this.spells.W, cooldown: 15 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    getAbility(ability: 'Q' | 'W'): Collideable {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    return new YasuoQ(this._spellQ, this._owner._side, this._owner)
                case 'W':
                    return new YasuoW(this._spellW, this._owner._side, this._owner)
                default:
                    break;
            }
        return null
    }
}


class Malphite extends Champion {
    constructor(side: TeamSide, owner: Player) {
        super('Malphite', source.Malphite, owner);
        this.spells.Q = deepCopy({ ...this.spells.W, cooldown: 5 })
        this.spells.W = deepCopy({ ...this.spells.R, cooldown: 15 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    getAbility(ability: 'Q' | 'W'): Collideable {
        if (this._canUseAbility(ability))
            switch (ability) {
                case 'Q':
                    return new MalphiteQ(this._spellW, this._owner._side, this._owner)
                case 'W':
                    const facingVector = (this._owner as Player)._facingVector.normalize()
                    const newPosition = this._owner.getPosition().add(facingVector.multiply(300))
                    this._owner.setPosition(newPosition)
                    return new MalphiteW(this._spellW, this._owner._side, this._owner)
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
    'Thresh': (side: TeamSide, owner: Player) => new Thresh(side, owner),
    'Shaco': (side: TeamSide, owner: Player) => new Shaco(side, owner),
    'Garen': (side: TeamSide, owner: Player) => new Garen(side, owner),
    'Anivia': (side: TeamSide, owner: Player) => new Anivia(side, owner),
    'Yasuo': (side: TeamSide, owner: Player) => new Yasuo(side, owner),
    'Malphite': (side: TeamSide, owner: Player) => new Malphite(side, owner),
}