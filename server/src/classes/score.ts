import { TeamSide } from "../types"
import Player from "./collideables/player"

export type ConvertedGoal = {
    side: TeamSide
    playerId: string
    playerName: string
    seconds: number
}

export class Score {
    _left: number = 0
    _right: number = 0
    _goals: ConvertedGoal[] = []

    constructor() {

    }

    reset(): void {
        this._left = 0
        this._right = 0
        this._goals = []
    }

    addGoal(side: TeamSide, player: Player, seconds: number) {
        //if there is a goal for the RIGHT side team, the goal goes to them etc
        if (side === 'RIGHT') this._right += 1
        else if (side === 'LEFT') this._left += 1
        this._goals.push({
            playerId: player._id,
            playerName: player._name,
            seconds,
            side,
        })
    }

    lastGoalSide(): TeamSide | null {
        if (this._goals.length) {
            return this._goals[this._goals.length - 1].side
        }
        return null
    }

    getWinner(): TeamSide {
        if (this._goals.length) {
            return this._left > this._right ? 'LEFT' : 'RIGHT'
        }
        return 'LEFT'
    }

    serialize() {
        return {
            left: this._left,
            right: this._right,
            goals: this._goals
        }
    }
}