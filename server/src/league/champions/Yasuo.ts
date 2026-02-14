import { source } from '../source'
import { Champion, ChampionSpell } from '../classes'
import { TeamSide } from '../../types'
import Player from '../../classes/collideables/player'
import { Collideable, CircleCollideable, PolygonCollideable } from '../../classes/collideables/physics';
import { deepCopy } from '../../utilities/objects';
import { Vector } from '../../classes/math';
import { PlayerRightSideCategory, PlayerLeftSideCategory, BallCategory, AbilityEffectCategory, WallCategory } from '../../classes/collideables/categories';
import { Body } from 'matter-js';
import { DEBUG, playerRadius } from '../../globals';

export default class Yasuo extends Champion {
    constructor(side: TeamSide, owner: Player) {
        super('Yasuo', source.Yasuo, owner);
        this.spells.Q = deepCopy({ ...this.spells.E, cooldown: DEBUG ? 0 :  2 })
        this.spells.W = deepCopy({ ...this.spells.W, cooldown: DEBUG ? 0 :  15 })
        this._spellQ = this.spells.Q
        this._spellW = this.spells.W
    }

    async getAbility(ability: 'Q' | 'W'): Promise<Collideable> {
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
    _dashTarget: Collideable = null
    _dashConnected: boolean = false
    _dashDirection: Vector
    _dashContactDistance: number = playerRadius + 12 + 2

    _targetRadius(target: Collideable): number {
        if (!target || !target._body) return 12
        if (target._body.circleRadius) return target._body.circleRadius

        // Fallback for non-circle bodies: project AABB half extents onto dash axis.
        const bounds = target.getBounds()
        const halfWidth = bounds.x / 2
        const halfHeight = bounds.y / 2
        const direction = this._dashDirection.normalize()
        return Math.abs(direction.x) * halfWidth + Math.abs(direction.y) * halfHeight
    }

    _passThroughPosition(target: Collideable): Vector {
        const anchor = target.getPosition()
        return anchor.add(this._dashDirection.normalize().multiply(this._dashContactDistance))
    }

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
                        const owner = this._body.plugin.owner as Player
                        const current = owner.getPosition()
                        const targetPosition = target.getPosition()
                        const distance = targetPosition.substract(current)
                        const baseDirection = distance.module() > 0 ? distance.normalize() : owner._facingVector.normalize()

                        this._dashConnected = true
                        this._dashTarget = target
                        this._dashDirection = baseDirection
                        this._dashContactDistance = this._targetRadius(target) + playerRadius + 2
                        this._targetPosition = this._passThroughPosition(target)
                        this.setPosition(current)
                    }
                }
            }
        })
        this._body.plugin.drawer = this
        this._dashDirection = owner._facingVector.normalize()
    }

    dematerialize() {
        (this._body.plugin.owner as Player).disableCollisions(false)
        super.dematerialize()
    }

    update(dt: number) {
        if (this._targetPosition) {
            const owner = this._body.plugin.owner as Player
            const current = owner.getPosition()

            if (this._dashTarget && this._dashTarget._body) {
                this._targetPosition = this._passThroughPosition(this._dashTarget)
            }

            // Keep dash strictly linear in initial hit direction to avoid orbiting/tractor behavior.
            const toPassPoint = this._targetPosition.substract(current)
            const remainingAlongDash = toPassPoint.dot(this._dashDirection.normalize())

            if (remainingAlongDash > 2) {
                owner.disableCollisions(true);
                owner._champion.clearCooldown('Q');

                const dashStep = Math.min(remainingAlongDash, 34)
                const newPosition = current.add(this._dashDirection.normalize().multiply(dashStep))
                owner.setPosition(newPosition)
                // Keep the effect mounted on Yasuo while dashing through the target.
                this.setPosition(newPosition)

            } else {
                // Snap to the pass-through side so Yasuo ends up attached to target's far side.
                owner.setPosition(this._targetPosition)
                this.setPosition(this._targetPosition)
                this._expired = true
                this._dashTarget = null
                this.dematerialize()
            }
        }
    }

    serialize(): any {
        const owner = this._body.plugin.owner as Player
        return {
            ...super.serialize(),
            connected: this._dashConnected,
            windDirection: (this._dashConnected ? this._dashDirection : owner._facingVector.normalize()).serialize(),
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
