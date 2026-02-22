import React, { useContext, useEffect, useRef, useState } from 'react'
import { ApplicationContext } from '../../../store'

const DISPLAY_FONT = "Beaufort for LOL, Cinzel, serif"

interface CountdownProps {
  width?: number
  height?: number
}

const Countdown = (props: CountdownProps) => {
  const { countdown } = useContext(ApplicationContext)
  const width = props.width || 0
  const height = props.height || 0
  const cx = width / 2
  const cy = height / 2

  const [goVisible, setGoVisible] = useState(false)
  const lastCountdown = useRef<number>(0)

  const current = countdown || 0
  const rounded = current > 0 ? Math.ceil(current) : 0

  useEffect(() => {
    const prev = lastCountdown.current
    lastCountdown.current = current

    if (prev > 0 && current === 0) {
      setGoVisible(true)
      const timer = setTimeout(() => setGoVisible(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [current])

  if (!width || !height) return null
  if (rounded === 0 && !goVisible) return null

  const text = goVisible ? 'GO!' : String(rounded)
  const isGo = goVisible
  const fontSize = isGo ? 96 : 120
  const fill = isGo ? '#4dc98f' : '#f3d498'
  const stroke = isGo ? '#1a6b45' : '#8b6914'

  return (
    <g>
      {/* Dark backdrop behind the number */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={DISPLAY_FONT}
        fontWeight={800}
        fontSize={fontSize}
        fill="none"
        stroke="rgba(0, 0, 0, 0.7)"
        strokeWidth={8}
        letterSpacing={isGo ? 8 : 4}
      >
        {text}
      </text>

      {/* Main number */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={DISPLAY_FONT}
        fontWeight={800}
        fontSize={fontSize}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
        letterSpacing={isGo ? 8 : 4}
      >
        {text}
      </text>

      {/* Outer glow ring that pulses */}
      {!isGo && (
        <circle
          cx={cx}
          cy={cy}
          r={80}
          fill="none"
          stroke="#c6a65e"
          strokeWidth={2}
          strokeOpacity={0.3}
        >
          <animate
            attributeName="r"
            values="70;85;70"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="strokeOpacity"
            values="0.3;0.15;0.3"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  )
}

export default Countdown
