import Player from "../classes/collideables/player"
import { World } from "matter-js"
import { TeamSide } from "../types"

export type ChampionName = 'Veigar' |
    'Lux'

export type ChampionList = {
    'Lux': (side: TeamSide) => Champion,
    'Veigar': (side: TeamSide) => Champion,
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

export class Champion {
    name: ChampionName
    movespeed: number
    hp: number
    armor: number
    attackspeed: number
    attackdamage: number
    spells: Array<{
        id: string
        sprite: string
        x: number
        y: number
        w: number
        h: number
    }>

    constructor(name: ChampionName, data: ChampionSourceStats) {
        this.name = name;
        this.movespeed = data.stats.movespeed;
        this.hp = data.stats.hp;
        this.armor = data.stats.armor;
        this.attackspeed = data.stats.attackspeed;
        this.attackdamage = data.stats.attackdamage;
        this.spells = data.spells.map(row => {
            return {
                id: row.id,
                sprite: row.image.sprite,
                x: row.image.x,
                y: row.image.y,
                w: row.image.w,
                h: row.image.h,
            }
        })
    }

    tryExecute(ability: 'Q' | 'W', player: Player, world: World) {

    }
}