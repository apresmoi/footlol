import { Champion, ChampionName, ChampionList } from './classes'

import { source } from './source'
import Player from '../classes/collideables/player'
import { World } from 'matter-js'
import { CircleCollideable, Collideable } from '../classes/collideables/physics'
import { Vector } from '../classes/math'
import { playerRadius } from '../globals'
import { TeamSide } from '../types'
import { AbilityProjectileCategory, PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory } from '../classes/collideables/categories'

class Veigar extends Champion {
    _abilityQ: Collideable
    _abilityW: Collideable

    constructor(side: TeamSide) {
        super('Veigar', source.Veigar);

        this._abilityQ = new CircleCollideable(20, new Vector(0, 0), 10, {
            collisionFilter: {
                category: AbilityProjectileCategory,
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
            }
        })
        this._abilityW = new CircleCollideable(10, new Vector(0, 0), playerRadius * 4, {
            isStatic: true,
            collisionFilter: {
                category: AbilityProjectileCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            }
        })
    }

    tryExecute(ability: 'Q' | 'W', player: Player, world: World) {
        switch (ability) {
            case 'Q':
                this._abilityQ.setPosition(player.getPosition())
                this._abilityQ.setVelocity(player._facingVector.multiply(10))
                this._abilityQ.materialize(world)
                setTimeout(() => {
                    this._abilityQ.dematerialize(world)
                }, 10 * 1000);
                break;
            case 'W':
                this._abilityW.setPosition(player.getPosition())
                this._abilityW.materialize(world)
                setTimeout(() => {
                    this._abilityW.dematerialize(world)
                }, 10 * 1000);
                break;
            default:
                break;
        }
    }
}


class Lux extends Champion {
    _abilityQ: Collideable
    _abilityW: Collideable

    constructor(side: TeamSide) {
        super('Lux', source.Lux);

        this._abilityQ = new CircleCollideable(10, new Vector(0, 0), 5, {

        })
        this._abilityW = new CircleCollideable(10, new Vector(0, 0), playerRadius * 4, {
            isStatic: true,
            collisionFilter: {

            }
        })
    }

    tryExecute(ability: 'Q' | 'W', player: Player, world: World) {
        switch (ability) {
            case 'Q':
                this._abilityQ.setPosition(player.getPosition())
                this._abilityQ.setVelocity(player._facingVector.multiply(10))
                this._abilityQ.materialize(world)
                setTimeout(() => {
                    this._abilityQ.dematerialize(world)
                }, 10 * 1000);
                break;
            case 'W':
                this._abilityW.setPosition(player.getPosition())
                this._abilityW.materialize(world)
                setTimeout(() => {
                    this._abilityW.dematerialize(world)
                }, 10 * 1000);
                break;
            default:
                break;
        }
    }
}


export const champions: ChampionList = {
    'Veigar': (side: TeamSide) => new Veigar(side),
    'Lux': (side: TeamSide) => new Lux(side),
}