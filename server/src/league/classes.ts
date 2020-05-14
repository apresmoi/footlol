import Player from "../classes/collideables/player"
import { World } from "matter-js"
import { TeamSide } from "../types"
import { Collideable } from "../classes/collideables/physics"
import { elapsedSeconds } from "../utilities/dates"

export type ChampionName = 'Veigar' | 'Ashe' | 'Amumu' | 'LeeSin' | 'Thresh'

export type ChampionList = {
    'Ashe': (side: TeamSide, owner: Player) => Champion,
    'Veigar': (side: TeamSide, owner: Player) => Champion,
    'Amumu': (side: TeamSide, owner: Player) => Champion,
    'LeeSin': (side: TeamSide, owner: Player) => Champion,
    'Thresh': (side: TeamSide, owner: Player) => Champion,
}

export class ChampionSourceStats {
    stats: {
        hp: number
        hpperlevel: number
        mp: number
        mpperlevel: number
        movespeed: number
        armor: number
        armorperlevel: number
        spellblock: number
        spellblockperlevel: number
        attackrange: number
        hpregen: number
        hpregenperlevel: number
        mpregen: number
        mpregenperlevel: number
        crit: number
        critperlevel: number
        attackdamage: number
        attackdamageperlevel: number
        attackspeedperlevel: number
        attackspeed: number
    }
    spells: Array<{
        id: string,
        name: string,
        cooldown: number,
        image: {
            full: string,
            sprite: string,
            x: number,
            y: number,
            w: number,
            h: number,
        }
    }>
}

export interface ChampionSpell {
    id: string
    sprite: string
    x: number
    y: number
    w: number
    h: number
    cooldown: number
}

export class Champion {
    _owner: Player

    name: ChampionName
    movespeed: number
    hp: number
    armor: number
    attackspeed: number
    attackdamage: number
    spells: { [key in 'Q' | 'W' | 'E' | 'R']: ChampionSpell }

    _spellQ: ChampionSpell
    _abilityQ: Collideable
    _tsQ: Date
    _spellW: ChampionSpell
    _abilityW: Collideable
    _tsW: Date

    constructor(name: ChampionName, data: ChampionSourceStats, owner: Player) {
        this._owner = owner
        this.name = name;
        this.movespeed = data.stats.movespeed;
        this.hp = data.stats.hp;
        this.armor = data.stats.armor;
        this.attackspeed = data.stats.attackspeed;
        this.attackdamage = data.stats.attackdamage;
        this.spells = data.spells.reduce((result, row, i) => {
            const letter = "QWER"[i]
            result[letter] = {
                id: row.id,
                sprite: row.image.sprite,
                x: row.image.x,
                y: row.image.y,
                w: row.image.w,
                h: row.image.h,
                cooldown: row.cooldown,
            }
            return result
        }, { Q: null, W: null, E: null, R: null })
    }

    _canUseAbility(ability: 'Q' | 'W'): boolean {
        if (ability === 'Q' && !this._tsQ) {
            this._tsQ = new Date()
            return true
        }
        else if (ability === 'W' && !this._tsW) {
            this._tsW = new Date()
            return true
        }
        return false
    }

    getCooldowns() {
        let Q: number = 0
        let W: number = 0
        if (this._tsQ) {
            let dt = elapsedSeconds(this._tsQ)
            if (dt > this._spellQ.cooldown) {
                Q = 0
                this._tsQ = null
            } else {
                Q = this._spellQ.cooldown - dt
            }
        }
        if (this._tsW) {
            let dt = elapsedSeconds(this._tsW)
            if (dt > this._spellW.cooldown) {
                W = 0
                this._tsW = null
            } else {
                W = this._spellW.cooldown - dt
            }
        }
        return {
            Q: Math.round(Q * 10) / 10,
            W: Math.round(W * 10) / 10
        }
    }

    getAbility(ability: 'Q' | 'W'): Collideable {
        return null
    }

    serialize() {
        return {
            name: this.name,
            spells: {
                Q: this.spells.Q,
                W: this.spells.W,
            }
        }
    }
}