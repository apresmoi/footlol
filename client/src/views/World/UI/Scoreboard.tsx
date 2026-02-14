import React, { useContext, useMemo } from 'react'
import { ApplicationContext } from '../../../store'
import { Player, ScoreGoal } from '../../../store/types'

interface ScoreboardProps {
  width?: number
  height?: number
  tabPressed?: boolean
}

type ScoreboardRow = {
  id: string
  name: string
  goals: number
}

const sortRows = (a: ScoreboardRow, b: ScoreboardRow): number => {
  if (b.goals !== a.goals) return b.goals - a.goals
  return a.name.localeCompare(b.name)
}

const Scoreboard = (props: ScoreboardProps) => {
  const { score, players } = useContext(ApplicationContext)
  const width = props.width || 0
  const height = props.height || 0

  const calculated = useMemo(() => {
    const goals: ScoreGoal[] = score?.goals || []
    const playerList: Player[] = Object.values(players || {})
    const playerIds = new Set(playerList.map((player) => player.id))
    const goalsByPlayer = goals.reduce((result, goal) => {
      result[goal.playerId] = (result[goal.playerId] || 0) + 1
      return result
    }, {} as { [playerId: string]: number })

    const rowsBySide = playerList.reduce((result, player) => {
      result[player.side].push({
        id: player.id,
        name: player.name,
        goals: goalsByPlayer[player.id] || 0
      })
      return result
    }, { LEFT: [] as ScoreboardRow[], RIGHT: [] as ScoreboardRow[] })

    goals.forEach((goal) => {
      if (playerIds.has(goal.playerId)) return
      const bucket = rowsBySide[goal.side]
      const key = `offline-${goal.playerId}-${goal.playerName}`
      const existing = bucket.find((row) => row.id === key)
      if (existing) {
        existing.goals += 1
        return
      }
      bucket.push({
        id: key,
        name: goal.playerName,
        goals: 1
      })
    })

    return {
      left: rowsBySide.LEFT.sort(sortRows),
      right: rowsBySide.RIGHT.sort(sortRows)
    }
  }, [players, score?.goals])

  if (!props.tabPressed || !score || !width || !height) return null

  const panelWidth = Math.min(Math.round(width * 0.84), 980)
  const panelHeight = Math.min(Math.round(height * 0.74), 520)
  const x = Math.round((width - panelWidth) / 2)
  const y = Math.round((height - panelHeight) / 2)
  const columnGap = 16
  const columnWidth = Math.round((panelWidth - columnGap * 3) / 2)
  const headerY = 102
  const rowHeight = 36

  const renderSide = (side: 'LEFT' | 'RIGHT', rows: ScoreboardRow[], offsetX: number, accent: string) => (
    <g transform={`translate(${offsetX}, ${headerY})`}>
      <rect x={0} y={0} width={columnWidth} height={rowHeight} fill="rgba(12, 19, 33, 0.94)" stroke={accent} strokeOpacity={0.45} />
      <text x={16} y={24} fill={accent} fontFamily="Rajdhani, sans-serif" fontSize={17} fontWeight={700}>
        {side === 'LEFT' ? 'Blue Team' : 'Red Team'}
      </text>
      <text x={columnWidth - 16} y={24} fill="#d8e6f3" textAnchor="end" fontFamily="Rajdhani, sans-serif" fontSize={17} fontWeight={700}>
        Goals
      </text>
      {rows.map((row, index) => {
        const rowY = rowHeight + index * rowHeight
        return (
          <g key={row.id}>
            <rect
              x={0}
              y={rowY}
              width={columnWidth}
              height={rowHeight}
              fill={index % 2 === 0 ? 'rgba(8, 13, 23, 0.9)' : 'rgba(9, 16, 28, 0.95)'}
              stroke="rgba(166, 188, 210, 0.11)"
            />
            <text x={16} y={rowY + 24} fill="#e7f2ff" fontFamily="Alegreya Sans, sans-serif" fontSize={18} fontWeight={600}>
              {row.name}
            </text>
            <text
              x={columnWidth - 16}
              y={rowY + 24}
              fill="#f0d08d"
              textAnchor="end"
              fontFamily="Cinzel, serif"
              fontSize={20}
              fontWeight={700}
            >
              {row.goals}
            </text>
          </g>
        )
      })}
    </g>
  )

  return (
    <g>
      <rect x={0} y={0} width={width} height={height} fill="rgba(2, 4, 7, 0.62)" />
      <g transform={`translate(${x}, ${y})`}>
        <defs>
          <linearGradient id="scoreboard-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(8, 18, 30, 0.98)" />
            <stop offset="100%" stopColor="rgba(4, 11, 21, 0.98)" />
          </linearGradient>
          <linearGradient id="scoreboard-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3e3ba" />
            <stop offset="55%" stopColor="#af8a4a" />
            <stop offset="100%" stopColor="#6a5328" />
          </linearGradient>
        </defs>

        <rect x={0} y={0} width={panelWidth} height={panelHeight} fill="url(#scoreboard-bg)" stroke="url(#scoreboard-border)" strokeWidth={2.5} rx={8} />
        <text x={panelWidth / 2} y={38} textAnchor="middle" fill="#f3d498" fontFamily="Cinzel, serif" fontSize={24} fontWeight={700}>
          Scoreboard
        </text>
        <line x1={columnGap} y1={84} x2={panelWidth - columnGap} y2={84} stroke="rgba(194, 169, 113, 0.35)" strokeWidth={1} />
        <text x={panelWidth / 2 - 30} y={74} textAnchor="end" fill="#78c6ff" fontFamily="Cinzel, serif" fontSize={31} fontWeight={700}>
          {score.left}
        </text>
        <text x={panelWidth / 2} y={74} textAnchor="middle" fill="#d6b777" fontFamily="Rajdhani, sans-serif" fontSize={19} fontWeight={700}>
          :
        </text>
        <text x={panelWidth / 2 + 30} y={74} textAnchor="start" fill="#ff8ea8" fontFamily="Cinzel, serif" fontSize={31} fontWeight={700}>
          {score.right}
        </text>

        {renderSide('LEFT', calculated.left, columnGap, '#7ec8ff')}
        {renderSide('RIGHT', calculated.right, columnGap * 2 + columnWidth, '#ff9ab5')}
      </g>
    </g>
  )
}

export default Scoreboard
