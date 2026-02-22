import React, { useContext } from 'react'
import { ApplicationContext } from '../../../store'

interface MatchResultProps {
  width?: number
  height?: number
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const MatchResult = (props: MatchResultProps) => {
  const context = useContext(ApplicationContext)
  if (!context.victory || !context.self) return null

  const width = props.width || 0
  const height = props.height || 0
  const cx = width / 2
  const cy = height / 2

  const isTie = context.victory === 'TIE'
  const isVictory = !isTie && context.self.side === context.victory

  const title = isTie ? 'TIE' : isVictory ? 'VICTORY' : 'DEFEAT'
  const titleColor = isTie ? '#c8d0dc' : isVictory ? '#f3d498' : '#8899aa'
  const titleStroke = isTie ? '#6a7080' : isVictory ? '#8b6914' : '#445566'
  const bgOpacity = isTie ? 0.45 : isVictory ? 0.35 : 0.5

  const matchResults = context.matchResults
  const scoreLeft = matchResults?.score?.left ?? 0
  const scoreRight = matchResults?.score?.right ?? 0
  const goals = matchResults?.goals ?? []

  const isAdmin = context.self.admin
  const titleY = cy - 30
  const scoreY = titleY + 50
  const goalsStartY = scoreY + 35
  const lobbyButtonY = goalsStartY + goals.length * 22 + 30

  return (
    <g className="match-result">
      <rect x={0} y={0} width={width} height={height} fill="black" opacity={0}>
        <animate attributeName="opacity" from="0" to={bgOpacity} dur="0.6s" fill="freeze" />
      </rect>

      <text
        x={cx}
        y={titleY}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Beaufort for LOL', 'Cinzel', serif"
        fontWeight={800}
        fontSize={56}
        fill={titleColor}
        stroke={titleStroke}
        strokeWidth={1.5}
        letterSpacing={title === 'TIE' ? 12 : 6}
        opacity={0}
      >
        {title}
        <animate attributeName="opacity" from="0" to="1" dur="0.8s" begin="0.3s" fill="freeze" />
      </text>

      <text
        x={cx}
        y={scoreY}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Beaufort for LOL', 'Cinzel', serif"
        fontWeight={700}
        fontSize={28}
        opacity={0}
      >
        <tspan fill="#4a9ff5">{scoreLeft}</tspan>
        <tspan fill="#aabbcc" dx={8}>-</tspan>
        <tspan fill="#e84057" dx={8}>{scoreRight}</tspan>
        <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.8s" fill="freeze" />
      </text>

      {goals.map((goal, i) => (
        <text
          key={i}
          x={cx}
          y={goalsStartY + i * 22}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Spiegel', 'Alegreya Sans', sans-serif"
          fontWeight={400}
          fontSize={14}
          fill={goal.side === 'LEFT' ? '#6aafff' : '#ff6a7a'}
          opacity={0}
        >
          <tspan fill="#889099">{formatTime(goal.seconds)}</tspan>
          <tspan dx={8}>{goal.playerName}</tspan>
          <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin={`${1.0 + i * 0.15}s`} fill="freeze" />
        </text>
      ))}

      {isAdmin && (
        <g
          className="match-result-lobby-btn"
          onClick={() => context.requestReturnToLobby()}
          cursor="pointer"
          opacity={0}
        >
          <rect
            x={cx - 90}
            y={lobbyButtonY - 14}
            width={180}
            height={32}
            rx={8}
            fill="rgba(80, 80, 100, 0.6)"
            stroke="rgba(120, 120, 140, 0.5)"
            strokeWidth={1}
          />
          <text
            x={cx}
            y={lobbyButtonY + 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Spiegel', 'Alegreya Sans', sans-serif"
            fontWeight={600}
            fontSize={13}
            fill="#aabbcc"
          >
            RETURN TO LOBBY
          </text>
          <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin={`${1.0 + goals.length * 0.15 + 0.3}s`} fill="freeze" />
        </g>
      )}
    </g>
  )
}

export default MatchResult
