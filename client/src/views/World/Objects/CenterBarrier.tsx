import React, { useContext } from 'react'
import { ApplicationContext } from '../../../store'
import { mapSize } from '../../../settings'

const RADIUS = mapSize.center.r
const CX = mapSize.center.x
const CY = mapSize.center.y
const FIELD_TOP = mapSize.field.y
const FIELD_BOTTOM = mapSize.field.y + mapSize.field.height

const CenterBarrier = () => {
  const { wallsUp, countdown, ball } = useContext(ApplicationContext)
  const ballAtCenter = ball &&
    Math.abs(ball.position.x - CX) < 10 &&
    Math.abs(ball.position.y - CY) < 10
  const visible = wallsUp || (countdown != null && countdown > 0) || ballAtCenter
  if (!visible) return null

  return (
    <g className="center-barrier">
      <defs>
        <linearGradient id="barrier-line-v" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f3d498" stopOpacity={0} />
          <stop offset="15%" stopColor="#c6a65e" stopOpacity={0.9} />
          <stop offset="50%" stopColor="#e0c179" stopOpacity={1} />
          <stop offset="85%" stopColor="#c6a65e" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#f3d498" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Wide soft glow — top line */}
      <line
        x1={CX} y1={FIELD_TOP}
        x2={CX} y2={CY - RADIUS}
        stroke="#c6a65e"
        strokeWidth={12}
        strokeOpacity={0.12}
      />
      {/* Sharp golden line — top */}
      <line
        x1={CX} y1={FIELD_TOP}
        x2={CX} y2={CY - RADIUS}
        stroke="url(#barrier-line-v)"
        strokeWidth={2.5}
      />

      {/* Wide soft glow — bottom line */}
      <line
        x1={CX} y1={CY + RADIUS}
        x2={CX} y2={FIELD_BOTTOM}
        stroke="#c6a65e"
        strokeWidth={12}
        strokeOpacity={0.12}
      />
      {/* Sharp golden line — bottom */}
      <line
        x1={CX} y1={CY + RADIUS}
        x2={CX} y2={FIELD_BOTTOM}
        stroke="url(#barrier-line-v)"
        strokeWidth={2.5}
      />

      {/* Circle — wide soft glow */}
      <circle
        cx={CX}
        cy={CY}
        r={RADIUS}
        fill="none"
        stroke="#c6a65e"
        strokeWidth={10}
        strokeOpacity={0.1}
      />
      {/* Circle — solid golden ring */}
      <circle
        cx={CX}
        cy={CY}
        r={RADIUS}
        fill="none"
        stroke="#e0c179"
        strokeWidth={2.5}
        strokeOpacity={0.7}
      />
      {/* Circle — rotating dashed overlay */}
      <circle
        cx={CX}
        cy={CY}
        r={RADIUS}
        fill="none"
        stroke="#f3d498"
        strokeWidth={1.5}
        strokeOpacity={0.4}
        strokeDasharray="12 8"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${CX} ${CY}`}
          to={`360 ${CX} ${CY}`}
          dur="10s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Orbs at intersections */}
      <circle cx={CX} cy={CY - RADIUS} r={6} fill="#f3d498" fillOpacity={0.8}>
        <animate attributeName="fillOpacity" values="0.8;0.5;0.8" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx={CX} cy={CY + RADIUS} r={6} fill="#f3d498" fillOpacity={0.8}>
        <animate attributeName="fillOpacity" values="0.8;0.5;0.8" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx={CX} cy={FIELD_TOP} r={5} fill="#f3d498" fillOpacity={0.6}>
        <animate attributeName="fillOpacity" values="0.6;0.3;0.6" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx={CX} cy={FIELD_BOTTOM} r={5} fill="#f3d498" fillOpacity={0.6}>
        <animate attributeName="fillOpacity" values="0.6;0.3;0.6" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </g>
  )
}

export default CenterBarrier
