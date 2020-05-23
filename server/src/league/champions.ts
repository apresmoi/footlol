import { ChampionList } from './classes'
import Player from '../classes/collideables/player'
import { TeamSide } from '../types'

import Ashe from './champions/Ashe'
import Veigar from './champions/Veigar'
import Amumu from './champions/Amumu'
import LeeSin from './champions/LeeSin'
import Thresh from './champions/Thresh'
import Shaco from './champions/Shaco'
import Garen from './champions/Garen'
import Anivia from './champions/Anivia'
import Yasuo from './champions/Yasuo'
import Malphite from './champions/Malphite'
import Ahri from './champions/Ahri'
import Lucian from './champions/Lucian'
// import AurelionSol from './champions/AurelionSol'



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
    'Ahri': (side: TeamSide, owner: Player) => new Ahri(side, owner),
    'Lucian': (side: TeamSide, owner: Player) => new Lucian(side, owner),
    // 'AurelionSol': (side: TeamSide, owner: Player) => new AurelionSol(side, owner),
}