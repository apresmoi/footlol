import Cone from "../classes/collideables/cone";
import { Vector } from "../classes/math";
import { TeamSide } from "../types";
import Player from "../classes/collideables/player";
import { ChampionSpell } from "./classes";
import { AbilityProjectileCategory, PlayerRightSideCategory, PlayerLeftSideCategory, AbilityStunCategory, AbilityEffectCategory, BallCategory, WallCategory } from "../classes/collideables/categories";
import { Body, World, Composites, Composite } from "matter-js";
import { CircleCollideable, Collideable, RectCollideable, PolygonCollideable } from "../classes/collideables/physics";
import Ring from "../classes/collideables/ring";
import { playerRadius } from "../globals";
import VectorCollideable from "../classes/collideables/vector";
import Ball from "../classes/collideables/ball";

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
    _targetPosition: Vector
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
                duration: 1000,
                velocity: 7,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor && !this._targetPosition) {
                        this.setVelocity(new Vector(0, 0))
                        this._body.plugin.duration = 1000
                        const current = this._body.plugin.owner.getPosition()
                        const distance = target.getPosition().substract(current)
                        this._targetPosition = current.add(distance.substract(distance.normalize().multiply(target.getBounds().module())))
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }

    update(dt: number) {
        if (this._targetPosition) {
            const current = this._body.plugin.owner.getPosition()
            const distance = this._targetPosition.substract(current).module()
            if (distance > 0) {
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
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
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
    _targetPosition: Vector
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
                    if (!target._body.isSensor && !this._targetPosition) {
                        this.setVelocity(new Vector(0, 0))
                        this._body.plugin.duration = 1000
                        const current = this._body.plugin.owner.getPosition()
                        const distance = target.getPosition().substract(current)
                        this._targetPosition = current.add(distance.substract(distance.normalize().multiply(target.getBounds().module())))
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }

    update(dt: number) {
        if (this._targetPosition) {
            const current = this._body.plugin.owner.getPosition()
            const distance = this._targetPosition.substract(current).module()
            if (distance > 0) {
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


export class ShacoW extends CircleCollideable {
    _visible: boolean = false
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(0, new Vector(0, 0), playerRadius * 4, {
            isStatic: true,
            isSensor: true,
            collisionFilter: {
                category: AbilityEffectCategory,
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 30000,
                velocity: 0,
                handleCollision: (target: Collideable) => {
                    if (!target._body.isSensor && !(target._body.plugin.owner instanceof Ball)) {
                        this._visible = true
                        const current = target.getPosition()
                        const direction = current.substract(this.getPosition()).normalize()
                        target.setStun(1500)
                        let iterations = 0
                        const interval = setInterval(() => {
                            if (iterations < 1500) {
                                iterations += 50
                                target.setPosition(target.getPosition().add(direction.multiply(1).setY(Math.random() * 4 - 2)))
                            } else {
                                clearInterval(interval)
                            }
                        }, 50)
                        setTimeout(() => {
                            this._expired = true
                            this.dematerialize()
                        }, 1500);
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }

    serialize(): any {
        return {
            type: 'circle',
            position: this.getPosition().serialize(),
            angle: this.getAngle(),
            radius: this._body.circleRadius,
            direction: this.getVelocity().director(),
            visible: this._visible
        }
    }
}


export class GarenW extends RectCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(100, new Vector(0, 0), playerRadius / 2, playerRadius * 6, 0, {
            // isStatic: true,
            collisionFilter: {
                category: AbilityProjectileCategory,
                mask: (side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory) | BallCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 4000,
                velocity: 0,
                angularVelocity: Math.PI / 10
            },
        })
        this._body.plugin.drawer = this
    }

    update(dt: number) {
        this.setPosition(this._body.plugin.owner.getPosition())
        this.setVelocity(this._body.plugin.owner.getVelocity(), this._body.plugin.angularVelocity)
    }

    // serialize(): any {
    //     return {
    //         type: 'vector',
    //         position: this._body.plugin.owner.getPosition().serialize(),
    //         to: this.getPosition().serialize(),
    //         radius: this._body.circleRadius
    //     }
    // }
}



export class AniviaW extends RectCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(20, new Vector(0, 0), playerRadius, playerRadius * 10, 0, {
            isStatic: true,
            collisionFilter: {
                category: WallCategory,
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 3500,
                velocity: 0,
            }
        })
        this._body.plugin.drawer = this
    }

    setPosition(position: Vector) {
        const facingVector = (this._body.plugin.owner as Player)._facingVector.normalize()
        const newPosition = position.add(facingVector.multiply(300))
        Body.setAngle(this._body, facingVector.angle());
        super.setPosition(newPosition)
    }
}

export class AniviaQ extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(10, new Vector(0, 0), 25, {
            isSensor: true,
            collisionFilter: {
                category: AbilityStunCategory,
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 1200,
                velocity: 7,
                effectDuration: 500,
                handleCollision: (target) => {
                    this._expired = true
                    this.dematerialize()
                }
            }
        })
        this._body.plugin.drawer = this
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



export class MalphiteQ extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(999999999, new Vector(0, 0), playerRadius * 3, {
            isStatic: true,
            restitution: 0,
            collisionFilter: {
                category: AbilityStunCategory,
                mask: side === 'LEFT' ? PlayerRightSideCategory : PlayerLeftSideCategory
            },
            plugin: {
                owner: owner,
                id: spell.id,
                duration: 100,
                effectDuration: 200,
                velocity: 0,
            }
        })
        this._body.plugin.drawer = this
    }
}

export class MalphiteW extends CircleCollideable {
    constructor(spell: ChampionSpell, side: TeamSide, owner: Player) {
        super(999999, new Vector(0, 0), playerRadius * 4, {
            restitution: 0,
            isSensor: true,
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
                        const velocity = target.getPosition().substract(this._body.plugin.owner.getPosition()).normalize().multiply(10)
                        target._body.plugin.owner.setVelocity(velocity, 5)
                        // this._expired = true
                        // this.dematerialize()
                    }
                }
            }
        })
        this._body.plugin.drawer = this
    }
}
