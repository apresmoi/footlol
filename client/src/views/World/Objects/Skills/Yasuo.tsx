import React from 'react';
import { PolygonEffect, CircleEffect } from '../../../../store/types';
import './styles.scss'

const YasuoQ = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, direction, windDirection, connected } = effect
  if (!connected) return null

  const dx = windDirection?.x ?? direction?.x ?? 1
  const dy = windDirection?.y ?? direction?.y ?? 0
  const magnitude = Math.hypot(dx, dy) || 1
  const angle = Math.atan2(dy / magnitude, dx / magnitude) * 180 / Math.PI
  const uidSeed = effect.instanceId ?? `${Math.round(position.x)}-${Math.round(position.y)}`
  const auraGradientId = `yasuoq-aura-${uidSeed}`
  const swirlGradientId = `yasuoq-swirl-${uidSeed}`
  const gustGradientId = `yasuoq-gust-${uidSeed}`
  const flareGradientId = `yasuoq-flare-${uidSeed}`

  return <g
    className="yasuo-q yasuo-q-connect"
    transform={`translate(${position.x}, ${position.y}) rotate(${angle})`}
  >
    <defs>
      <radialGradient id={auraGradientId} cx="45%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#c9f2ff" stopOpacity={0.52} />
        <stop offset="70%" stopColor="#8dd5f5" stopOpacity={0.22} />
        <stop offset="100%" stopColor="#6ebfe8" stopOpacity={0} />
      </radialGradient>
      <linearGradient id={swirlGradientId} x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#85c9ea" stopOpacity={0.08} />
        <stop offset="48%" stopColor="#dff8ff" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#9dddf8" stopOpacity={0.12} />
      </linearGradient>
      <linearGradient id={gustGradientId} x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#9fddf8" stopOpacity={0.02} />
        <stop offset="38%" stopColor="#d3f6ff" stopOpacity={0.45} />
        <stop offset="100%" stopColor="#f6fdff" stopOpacity={0.95} />
      </linearGradient>
      <radialGradient id={flareGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f8feff" stopOpacity={0.95} />
        <stop offset="100%" stopColor="#97d8f8" stopOpacity={0} />
      </radialGradient>
    </defs>

    <ellipse className="yasuo-q-aura" cx={0} cy={0} rx={18} ry={12} fill={`url(#${auraGradientId})`} />
    <ellipse className="yasuo-q-aura" cx={-6} cy={0} rx={10} ry={7} fill={`url(#${auraGradientId})`} />

    <path
      className="yasuo-q-orbit"
      d="M -18 -2 C -7 -14 9 -14 18 -2"
      fill="none"
      stroke={`url(#${swirlGradientId})`}
      strokeWidth={1.5}
      strokeDasharray="9 8"
    >
      <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="0.34s" repeatCount="indefinite" />
    </path>
    <path
      className="yasuo-q-orbit"
      d="M -18 2 C -7 14 9 14 18 2"
      fill="none"
      stroke={`url(#${swirlGradientId})`}
      strokeWidth={1.3}
      strokeDasharray="9 9"
    >
      <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="0.32s" repeatCount="indefinite" />
    </path>

    <path className="yasuo-q-gust-core" d="M 2 0 C 18 -7 44 -7 66 0 C 44 7 18 7 2 0 Z" fill={`url(#${gustGradientId})`} />
    <path
      className="yasuo-q-gust-edge"
      d="M 0 -5 Q 27 -14 64 -5"
      fill="none"
      stroke="rgba(225, 251, 255, 0.72)"
      strokeWidth={1.2}
      strokeDasharray="9 10"
    >
      <animate attributeName="stroke-dashoffset" from="0" to="-42" dur="0.34s" repeatCount="indefinite" />
    </path>
    <path
      className="yasuo-q-gust-edge"
      d="M 0 5 Q 27 14 64 5"
      fill="none"
      stroke="rgba(191, 235, 255, 0.62)"
      strokeWidth={1.1}
      strokeDasharray="8 11"
    >
      <animate attributeName="stroke-dashoffset" from="0" to="-42" dur="0.32s" repeatCount="indefinite" />
    </path>
    <ellipse className="yasuo-q-flare" cx={69} cy={0} rx={11} ry={6.2} fill={`url(#${flareGradientId})`} />
  </g >
}

const YasuoW = (props: { effect: PolygonEffect }) => {
  const { effect } = props
  const { points } = effect
  if (!points || points.length < 3) return null

  const count = points.length
  const centerX = points.reduce((sum, point) => sum + point[0], 0) / count
  const centerY = points.reduce((sum, point) => sum + point[1], 0) / count

  let covXX = 0
  let covYY = 0
  let covXY = 0
  points.forEach((point) => {
    const dx = point[0] - centerX
    const dy = point[1] - centerY
    covXX += dx * dx
    covYY += dy * dy
    covXY += dx * dy
  })

  const axisAngle = 0.5 * Math.atan2(2 * covXY, covXX - covYY)
  const cosA = Math.cos(axisAngle)
  const sinA = Math.sin(axisAngle)

  // Project points to a local frame aligned with the wall long-axis.
  const localPoints = points.map((point): [number, number] => {
    const dx = point[0] - centerX
    const dy = point[1] - centerY
    const along = dx * cosA + dy * sinA
    const across = -dx * sinA + dy * cosA
    return [along, across]
  })

  const alongValues = localPoints.map((point) => point[0])
  const acrossValues = localPoints.map((point) => point[1])
  const minAlong = Math.min(...alongValues)
  const maxAlong = Math.max(...alongValues)
  const minAcross = Math.min(...acrossValues)
  const maxAcross = Math.max(...acrossValues)
  const length = Math.max(1, maxAlong - minAlong)
  const thickness = Math.max(1, maxAcross - minAcross)
  const waveAmplitude = Math.max(4, thickness * 0.2)
  const sideInset = Math.max(1.5, thickness * 0.1)

  const uidSeed = effect.instanceId ?? `${Math.round(centerX)}-${Math.round(centerY)}-${points.length}`
  const wallGradientId = `yasuow-wall-${uidSeed}`
  const coreGradientId = `yasuow-core-${uidSeed}`
  const hazeGradientId = `yasuow-haze-${uidSeed}`
  const streamGradientId = `yasuow-stream-${uidSeed}`
  const sparkGradientId = `yasuow-spark-${uidSeed}`
  const clipId = `yasuow-clip-${uidSeed}`
  const localPointString = localPoints.map((point) => `${point[0]},${point[1]}`).join(' ')
  const innerOffsets = [-0.36, -0.18, 0, 0.18, 0.36].map((ratio) => ratio * thickness)
  const angleDeg = axisAngle * 180 / Math.PI

  return <g
    className="yasuo-w"
  >
    <defs>
      <linearGradient id={wallGradientId} gradientUnits="userSpaceOnUse" x1={minAlong} y1={minAcross} x2={maxAlong} y2={maxAcross}>
        <stop offset="0%" stopColor="#79b9d6" stopOpacity={0.48} />
        <stop offset="40%" stopColor="#4f7e9c" stopOpacity={0.32} />
        <stop offset="100%" stopColor="#7fd3f0" stopOpacity={0.52} />
      </linearGradient>
      <linearGradient id={coreGradientId} gradientUnits="userSpaceOnUse" x1={minAlong} y1={0} x2={maxAlong} y2={0}>
        <stop offset="0%" stopColor="#c3ecff" stopOpacity={0.14} />
        <stop offset="50%" stopColor="#dff8ff" stopOpacity={0.46} />
        <stop offset="100%" stopColor="#b4e8ff" stopOpacity={0.12} />
      </linearGradient>
      <linearGradient id={hazeGradientId} gradientUnits="userSpaceOnUse" x1={minAlong} y1={0} x2={maxAlong} y2={0}>
        <stop offset="0%" stopColor="#c8f1ff" stopOpacity={0.02} />
        <stop offset="48%" stopColor="#ecfcff" stopOpacity={0.45} />
        <stop offset="100%" stopColor="#c4eeff" stopOpacity={0.03} />
      </linearGradient>
      <linearGradient id={streamGradientId} gradientUnits="userSpaceOnUse" x1={minAlong} y1={0} x2={maxAlong} y2={0}>
        <stop offset="0%" stopColor="#c9f3ff" stopOpacity={0.12} />
        <stop offset="50%" stopColor="#f2fcff" stopOpacity={0.95} />
        <stop offset="100%" stopColor="#c1efff" stopOpacity={0.14} />
      </linearGradient>
      <radialGradient id={sparkGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#b6edff" stopOpacity={0.6} />
        <stop offset="100%" stopColor="#b6edff" stopOpacity={0} />
      </radialGradient>
      <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
        <polygon points={localPointString} />
      </clipPath>
    </defs>

    <g transform={`translate(${centerX} ${centerY}) rotate(${angleDeg})`}>
      <polygon
        className="yasuo-w-shell"
        stroke="rgba(147, 228, 255, 0.74)"
        strokeWidth="3.2"
        fill={`url(#${wallGradientId})`}
        points={localPointString}
      />
      <polygon
        className="yasuo-w-edge"
        stroke="rgba(220, 248, 255, 0.78)"
        strokeWidth="1.2"
        fill="none"
        points={localPointString}
      />

      <path
        className="yasuo-w-rim"
        d={`M ${minAlong + sideInset} ${minAcross + sideInset} L ${maxAlong - sideInset} ${minAcross + sideInset}`}
        fill="none"
        stroke="rgba(214, 249, 255, 0.56)"
        strokeWidth={1}
        strokeDasharray="13 10"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-52" dur="0.8s" repeatCount="indefinite" />
      </path>
      <path
        className="yasuo-w-rim"
        d={`M ${minAlong + sideInset} ${maxAcross - sideInset} L ${maxAlong - sideInset} ${maxAcross - sideInset}`}
        fill="none"
        stroke="rgba(214, 249, 255, 0.48)"
        strokeWidth={0.9}
        strokeDasharray="13 10"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-52" dur="0.86s" repeatCount="indefinite" />
      </path>

      <g clipPath={`url(#${clipId})`}>
        <rect className="yasuo-w-core" x={minAlong} y={minAcross} width={length} height={thickness} fill={`url(#${coreGradientId})`} />
        <rect
          className="yasuo-w-inner-haze"
          x={minAlong + length * 0.06}
          y={-thickness * 0.24}
          width={length * 0.88}
          height={thickness * 0.48}
          fill={`url(#${hazeGradientId})`}
        />
        {innerOffsets.map((offset, index) => (
          <path
            key={`stream-${index}`}
            className="yasuo-w-stream"
            d={`M ${minAlong + 4} ${offset} Q ${minAlong + length * 0.5} ${offset + (index % 2 === 0 ? -waveAmplitude : waveAmplitude)} ${maxAlong - 4} ${offset}`}
            fill="none"
            stroke={`url(#${streamGradientId})`}
            strokeWidth={1.05 + (index % 2 ? 0.2 : 0)}
            strokeDasharray={`${14 + index * 2} ${13 + (4 - index)}`}
          >
            <animate attributeName="stroke-dashoffset" from="0" to={`${-64 - index * 10}`} dur={`${0.75 + index * 0.08}s`} repeatCount="indefinite" />
          </path>
        ))}
      </g>

      <path
        className="yasuo-w-gust"
        d={`M ${minAlong + 3} ${minAcross - thickness * 0.36} Q ${minAlong + length * 0.5} ${minAcross - thickness * 0.58} ${maxAlong - 3} ${minAcross - thickness * 0.36}`}
        fill="none"
        stroke="rgba(204, 248, 255, 0.5)"
        strokeWidth={1.05}
        strokeDasharray="10 12"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-70" dur="0.9s" repeatCount="indefinite" />
      </path>
      <path
        className="yasuo-w-gust"
        d={`M ${minAlong + 3} ${maxAcross + thickness * 0.36} Q ${minAlong + length * 0.5} ${maxAcross + thickness * 0.58} ${maxAlong - 3} ${maxAcross + thickness * 0.36}`}
        fill="none"
        stroke="rgba(204, 248, 255, 0.42)"
        strokeWidth={1}
        strokeDasharray="10 13"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-70" dur="0.95s" repeatCount="indefinite" />
      </path>

      {[0.16, 0.34, 0.52, 0.7, 0.88].map((position, index) => (
        <circle
          key={`spark-${index}`}
          cx={minAlong + length * position}
          cy={index % 2 === 0 ? -thickness * 0.34 : thickness * 0.34}
          r={2}
          fill={`url(#${sparkGradientId})`}
        >
          <animate attributeName="opacity" values="0.2;0.95;0.2" dur={`${0.72 + index * 0.1}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  </g >
}


export { YasuoW, YasuoQ };
