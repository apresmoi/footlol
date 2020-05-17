import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import { Collideable, CircleCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { AbilityProjectileCategory, PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityStunCategory } from '../../classes/collideables/categories';
import Cone from '../../classes/collideables/cone'
import { Body } from 'matter-js'

export default class Ashe extends Champion {
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

export class AsheQ extends Cone {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(20, new Vector(0, 0), 50, Math.PI, {
            collisionFilter: {
                category: AbilityProjectileCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            restitution: 0,
            mass: 99999999999,
            inertia: 99999999999,
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 500,
                velocity: 6,
            }
        })
        this._body.plugin.drawer = this
    }

    _scale = new Vector(1, 1)
    update(dt: number) {
        const f = dt / 2000
        Body.scale(this._body, 1 / this._scale.x, 1 / this._scale.y)
        this._scale = this._scale.add(new Vector(f, f))
        Body.scale(this._body, this._scale.x, this._scale.y)
        super.update(dt)
    }
}

export class AsheW extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(99999999, new Vector(0, 0), 25, {
            collisionFilter: {
                category: AbilityStunCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            mass: 99999999,
            inertia: 99999999,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 10000,
                velocity: 10,
                effectDuration: 2500,
                handleCollision: (target) => {
                    this._expired = true
                    this.dematerialize()
                }
            }
        })

        this._body.plugin.drawer = this
    }
}

