export type RoomSide = 'LEFT' | 'RIGHT'
export type RoomSensors = 'LEFT_GOAL' | 'RIGHT_GOAL'
export type ConvertedGoal = { side: RoomSide, playerId: string, seconds: number }
export type RoomScore = { left: number, right: number, goals: ConvertedGoal[] }
export type ResetType = 'GOAL' | 'RESET'
