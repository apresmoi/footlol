import { Champion, ChampionName } from './classes'

export const champions: { [name in ChampionName]: Champion } = {
    'Lux': new Champion('Lux', 50),
    'Garen': new Champion('Garen', 50),
    'Nami': new Champion('Nami', 50),
}