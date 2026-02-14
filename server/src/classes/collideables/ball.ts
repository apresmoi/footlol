import { CircleCollideable } from "./physics";
import { ballRadius, ballMass, mapSize } from "../../globals";
import { Vector } from "../math";
import Player from "./player";
import { BallCategory } from "./categories";

export type BallKicker = { player: Player, seconds: number }
export type BallStateType = 'frozen' | 'stunned' | 'slowed'
export type SerializedBallState = { type: BallStateType, remainingMs: number }
export default class Ball extends CircleCollideable {
    _kickers: BallKicker[] = []
    _kicked: boolean = false
    _stateUntil: Record<BallStateType, number> = {
        frozen: 0,
        stunned: 0,
        slowed: 0,
    }

    constructor(position: Vector) {
        super(ballMass, position, ballRadius, {
            restitution: 0.9,
            frictionAir: 0.02,
            collisionFilter: {
                category: BallCategory,
            },
        });
        this._body.plugin.owner = this
        this._movementBounds = [new Vector(0, 0), new Vector(mapSize.width, mapSize.height)]
    }

    reinit = (position: Vector): Ball => {
        const copy = new Ball(position);
        copy._body.plugin.owner = this
        return copy
    }

    clearKickers(): void {
        this._kickers = []
    }

    _pruneStates(): void {
        const now = Date.now()
        ; (Object.keys(this._stateUntil) as BallStateType[]).forEach((state) => {
            if (this._stateUntil[state] <= now) this._stateUntil[state] = 0
        })
    }

    clearStates(): void {
        this._stateUntil.frozen = 0
        this._stateUntil.stunned = 0
        this._stateUntil.slowed = 0
        this.clearSlow()
    }

    applyState(state: BallStateType, durationMs: number): void {
        if (!durationMs || durationMs <= 0) return
        const until = Date.now() + durationMs
        this._stateUntil[state] = Math.max(this._stateUntil[state], until)
    }

    applyStateFromAbility(abilityId: string, durationMs: number): void {
        if (!abilityId || !durationMs || durationMs <= 0) return

        if (abilityId === 'FlashFrost' || abilityId === 'EnchantedCrystalArrow') {
            this.applyState('frozen', durationMs)
            return
        }

        if (
            abilityId === 'Obduracy'
            || abilityId === 'UFSlash'
            || abilityId === 'VeigarEventHorizon'
            || abilityId === 'BandageToss'
            || abilityId === 'CurseoftheSadMummy'
        ) {
            this.applyState('stunned', durationMs)
        }
    }

    getStates(): SerializedBallState[] {
        this._pruneStates()
        const now = Date.now()
        const states = (Object.keys(this._stateUntil) as BallStateType[])
            .filter((state) => this._stateUntil[state] > now)
            .map((state) => ({
                type: state,
                remainingMs: Math.max(0, this._stateUntil[state] - now)
            }))

        const slowRemaining = this.getSlowRemainingMs()
        if (slowRemaining > 0) {
            states.push({ type: 'slowed', remainingMs: slowRemaining })
        }

        return states
    }

    addKicker(seconds: number, player: Player): void {
        this._kickers.push({
            player,
            seconds
        })
    }

    getLastKicker(): BallKicker | null {
        if (this._kickers.length) {
            return this._kickers[this._kickers.length - 1]
        }
        return null
    }

    update(dt: number): void {
        this._pruneStates()
        if (this.getSlowMultiplier() < 1) {
            const velocity = this.getVelocity()
            this.setVelocity(velocity.multiply(0.992), this._body.angularVelocity || 0)
        }
        super.update(dt)
    }

    serialize(): any {
        return {
            position: this.getPosition().serialize(),
            angle: this.getAngle(),
            states: this.getStates()
        }
    }
}
