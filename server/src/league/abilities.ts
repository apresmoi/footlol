import Cone from "../classes/collideables/cone";
import { Vector } from "../classes/math";
import { TeamSide } from "../types";
import Player from "../classes/collideables/player";
import { ChampionSpell } from "./classes";
import { AbilityProjectileCategory, PlayerRightSideCategory, PlayerLeftSideCategory, AbilityStunCategory, AbilityEffectCategory, BallCategory } from "../classes/collideables/categories";
import { Body, World } from "matter-js";
import { CircleCollideable, Collideable } from "../classes/collideables/physics";
import Ring from "../classes/collideables/ring";
import { playerRadius } from "../globals";
import VectorCollideable from "../classes/collideables/vector";


export class AsheQ extends Cone {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(20, new Vector(0, 0), 50, Math.PI, {
            collisionFilter: {
                category: AbilityProjectileCategory,
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
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
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
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

export class VeigarQ extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(20, new Vector(0, 0), 10, {
            collisionFilter: {
                category: AbilityProjectileCategory,
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 250,
                velocity: 15,
            }
        })
        this._body.plugin.drawer = this
    }
}

export class VeigarW extends Ring {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(5, new Vector(0, 0), playerRadius * 6, playerRadius, {
            isStatic: true,
            restitution: 0,
            collisionFilter: {
                category: AbilityStunCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 3000,
                effectDuration: 1500,
                velocity: 0,
            }
        })
        const self = this
        this._body.plugin.drawer = self
        this._body.parts.forEach(part => {
            part.plugin.drawer = self
        })
    }
}

export class AmumuQ extends VectorCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(0, new Vector(0, 0), 10, {
            restitution: 0,
            isSensor: true,
            collisionFilter: {
                category: AbilityEffectCategory,
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 700,
                velocity: 7,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor) {
                        this._body.plugin.owner.setVelocity(new Vector(0, 0), 0)
                        const current = this._body.plugin.owner.getPosition()
                        const distance = target.getPosition().substract(current)
                        this._body.plugin.owner.setPosition(current.add(distance.substract(distance.normalize().multiply(target.getBounds().module() / 2 + 5))))
                        this._expired = true
                        this.dematerialize()
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }

    materialize(world: World) {
        this._body.plugin.owner.setVelocity(new Vector(0, 0), 0)
        super.materialize(world)
    }

    setVelocity(velocity: Vector, angularVelocity: number = 0): void {
        super.setVelocity(velocity, angularVelocity)
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

export class AmumuW extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(999999999, new Vector(0, 0), playerRadius * 8, {
            isStatic: true,
            restitution: 0,
            collisionFilter: {
                category: AbilityStunCategory,
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 2000,
                effectDuration: 2500,
                velocity: 0,
            }
        })
        this._body.plugin.drawer = this
    }
}


export class LeeSinQ extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(0, new Vector(0, 0), 10, {
            restitution: 0,
            isSensor: true,
            collisionFilter: {
                category: AbilityEffectCategory,
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 350,
                velocity: 14,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor) {
                        console.log(target)
                        const current = this._body.plugin.owner.getPosition()
                        const distance = target.getPosition().substract(current)
                        this._body.plugin.owner.setPosition(current.add(distance.substract(distance.normalize().multiply(target.getBounds().module() / 2 + 5))))
                        this._expired = true
                        this.dematerialize()
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }

    materialize(world: World) {
        super.materialize(world)
    }

    // _scale = new Vector(1, 1)
    // update(dt: number) {
    //     const f = dt / 2000
    //     Body.scale(this._body, 1 / this._scale.x, 1 / this._scale.y)
    //     this._scale = this._scale.add(new Vector(f, f))
    //     Body.scale(this._body, this._scale.x, this._scale.y)
    //     super.update(dt)
    // }
}

export class LeeSinW extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(999999, new Vector(0, 0), playerRadius * 2, {
            restitution: 0,
            collisionFilter: {
                category: AbilityEffectCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            mass: 999999999,
            inertia: 999999999,
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 500,
                velocity: 0,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor) {
                        const velocity = target.getPosition().substract(this._body.plugin.owner.getPosition()).normalize().multiply(20)
                        console.log(velocity)
                        target._body.plugin.owner.setVelocity(velocity, 5)
                        this._expired = true
                        this.dematerialize()
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }
}


export class ThreshQ extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(0, new Vector(0, 0), 10, {
            restitution: 0,
            isSensor: true,
            collisionFilter: {
                category: AbilityEffectCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 700,
                velocity: 7,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor) {
                        const current = this._body.plugin.owner.getPosition()
                        const distance = target.getPosition().substract(current)
                        this._body.plugin.owner.setPosition(current.add(distance.substract(distance.normalize().multiply(target.getBounds().module() / 2 + 20))))
                        this._expired = true
                        this.dematerialize()
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }

    serialize(): any {
        return {
            type: 'vector',
            position: this._body.plugin.owner.getPosition().serialize(),
            to: this.getPosition().serialize(),
            radius: this._body.circleRadius
        }
    }
}

export class ThreshW extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(0, new Vector(0, 0), playerRadius * 1.1, {
            isStatic: true,
            restitution: 0,
            isSensor: true,
            collisionFilter: {
                category: AbilityEffectCategory,
                mask: side === 'LEFT' ? PlayerLeftSideCategory : PlayerRightSideCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 4000,
                velocity: 0,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor) {
                        const current = target.getPosition()
                        const distance = this._body.plugin.owner.getPosition().substract(current)
                        target.setPosition(current.add(distance.substract(distance.normalize().multiply(target.getBounds().module() / 2 + 5))))
                        this._expired = true
                        this.dematerialize()
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }

    setPosition(position: Vector) {
        const newPosition = position.add((this._body.plugin.owner as Player)._facingVector.normalize().multiply(300))
        console.log(position, newPosition)
        super.setPosition(newPosition)
    }

    serialize(): any {
        return {
            type: 'vector',
            position: this._body.plugin.owner.getPosition().serialize(),
            to: this.getPosition().serialize(),
            radius: this._body.circleRadius
        }
    }
}