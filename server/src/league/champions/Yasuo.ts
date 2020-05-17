import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import { Collideable, CircleCollideable, PolygonCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityEffectCategory, WallCategory } from '../../classes/collideables/categories';
import { Body } from 'matter-js';

export default class Yasuo extends Champion {
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

export class YasuoQ extends CircleCollideable {
    _targetPosition: Vector
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(0, new Vector(0, 0), 10, {
            isSensor: true,
            collisionFilter: {
                category: AbilityEffectCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 100,
                velocity: 40,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor && !this._targetPosition) {
                        this.setVelocity(new Vector(0, 0))
                        this._body.plugin.duration = 1000
                        const current = this._body.plugin.owner.getPosition()
                        const distance = target.getPosition().substract(current)
                        this._targetPosition = current.add(distance.add(distance.normalize().multiply(target.getBounds().module())))
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }

    dematerialize() {
        (this._body.plugin.owner as Player).disableCollisions(false)
        super.dematerialize()
    }

    update(dt: number) {
        if (this._targetPosition) {
            const current = this._body.plugin.owner.getPosition()
            const distance = this._targetPosition.substract(current).module()
            if (distance > 0) {
                (this._body.plugin.owner as Player).disableCollisions(true);
                (this._body.plugin.owner as Player)._champion.clearCooldown('Q');
                this._body.plugin.owner.setPosition(
                    current
                        .setX(current.x + (this._targetPosition.x - current.x) / 10)
                        .setY(current.y + (this._targetPosition.y - current.y) / 10)
                )

            } else {
                this._expired = true
                this.dematerialize()
            }
        }
    }
}
export class YasuoW extends PolygonCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(0, new Vector(0, 0), [[

            new Vector(40, 0 * 3),
            new Vector(47, 12 * 3),
            new Vector(50, 30 * 3),
            new Vector(50, 50 * 3),
            new Vector(50, 70 * 3),
            new Vector(47, 88 * 3),
            new Vector(40, 100 * 3),

            new Vector(20, 100 * 3),
            new Vector(27, 88 * 3),
            new Vector(30, 70 * 3),
            new Vector(30, 50 * 3),
            new Vector(30, 30 * 3),
            new Vector(27, 12 * 3),
            new Vector(20, 0 * 3),

        ]], {
            isStatic: true,
            collisionFilter: {
                category: WallCategory,
                mask: BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 3500,
                velocity: 0,
            }
        })
    }

    setPosition(position: Vector) {
        const facingVector = (this._body.plugin.owner as Player)._facingVector.normalize()
        const newPosition = position.add(facingVector.multiply(300))
        Body.setAngle(this._body, facingVector.angle());
        super.setPosition(newPosition)
    }
}

