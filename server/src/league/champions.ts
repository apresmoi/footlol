import { Champion, ChampionName } from './classes'

export const champions: { [name in ChampionName]: Champion } = {
    'Lux': new Champion('Lux', 50),
    'Garen': new Champion('Garen', 75),
    'Nami': new Champion('Nami', 40),
    'Veigar': new Champion('Veigar', 30),
    'Shaco': new Champion('Shaco', 50),
    'Darius': new Champion('Darius', 50),
    'Yasuo': new Champion('Yasuo', 70),
}