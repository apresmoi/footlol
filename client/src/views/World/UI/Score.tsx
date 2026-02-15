import React, { useContext } from 'react'
import { ApplicationContext } from '../../../store'

const DISPLAY_FONT = "Beaufort for LOL, Cinzel, serif"
const UI_FONT = "Spiegel, Alegreya Sans, sans-serif"

interface ScoreProps {
  width?: number
  height?: number
}

const Score = (props: ScoreProps) => {
  const { score, countdown, time } = useContext(ApplicationContext)
  if (!score) return null

  const total = countdown || time || 0
  const minutes = Math.trunc(total / 60)
  const seconds = Math.floor(total - minutes * 60)
  const clock = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`

  const centerX = (props.width || 0) / 2
  const leftScoreX = -118
  const rightScoreX = 118

  return (
    <g transform={`translate(${centerX}, 14)`}>
      <defs>
        <linearGradient id="topbar-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(8, 20, 27, 0.95)" />
          <stop offset="100%" stopColor="rgba(6, 14, 22, 0.95)" />
        </linearGradient>
        <linearGradient id="topbar-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4e8c4" />
          <stop offset="50%" stopColor="#b6924e" />
          <stop offset="100%" stopColor="#6c5228" />
        </linearGradient>
      </defs>

      <path
        d="M-212,0 L212,0 L212,50 L18,50 L0,66 L-18,50 L-212,50 Z"
        fill="url(#topbar-bg)"
        stroke="url(#topbar-gold)"
        strokeWidth={2.4}
      />
      <line x1={-212} y1={26} x2={212} y2={26} stroke="rgba(143, 184, 212, 0.16)" strokeWidth={1} />
      <line x1={-62} y1={6} x2={-62} y2={44} stroke="rgba(212, 182, 113, 0.23)" strokeWidth={1} />
      <line x1={62} y1={6} x2={62} y2={44} stroke="rgba(212, 182, 113, 0.23)" strokeWidth={1} />

      <circle cx={leftScoreX - 34} cy={25} r={8} fill="#255f9b" stroke="#7db7f5" strokeOpacity={0.7} />
      <circle cx={rightScoreX + 34} cy={25} r={8} fill="#873a49" stroke="#f39ab0" strokeOpacity={0.7} />

      <text
        x={leftScoreX}
        y={32}
        textAnchor="middle"
        fontFamily={DISPLAY_FONT}
        fontSize={29}
        fontWeight={700}
        fill="#78c6ff"
      >
        {score.left}
      </text>

      <text
        x={0}
        y={32}
        textAnchor="middle"
        fontFamily={UI_FONT}
        fontSize={18}
        fontWeight={700}
        fill="#e2bf77"
      >
        {clock}
      </text>

      <text
        x={rightScoreX}
        y={32}
        textAnchor="middle"
        fontFamily={DISPLAY_FONT}
        fontSize={29}
        fontWeight={700}
        fill="#ff8ea8"
      >
        {score.right}
      </text>
    </g>
  )
}

export default Score
