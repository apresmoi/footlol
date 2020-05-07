export type ChampionName = 'Lux' | 'Nami' | 'Garen'

export class Champion {
    name: ChampionName
    mass: number

    constructor(name: ChampionName, mass: number) {
        this.name = name;
        this.mass = mass;
    }
}