import React from 'react';
import { CircleEffect, RectEffect } from '../../../../store/types';
import './styles.scss'

const effectId = (effect: CircleEffect | RectEffect, suffix: string) => {
  const fallback = `${Math.round(effect.position.x)}-${Math.round(effect.position.y)}`
  return `anivia-${suffix}-${effect.instanceId || fallback}`
}

const toPolar = (distance: number, angleDeg: number) => {
  const angle = angleDeg * Math.PI / 180
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance }
}

const AniviaW = (props: { effect: RectEffect }) => {
  const { effect } = props
  const { position, width, height, angle } = effect

  const wallGradientId = effectId(effect, 'w-wall')
  const frostGradientId = effectId(effect, 'w-frost')
  const crackPatternId = effectId(effect, 'w-crack')

  const shardCount = Math.max(6, Math.round(height / 36))
  const shardStep = height / (shardCount + 1)

  return <g
    className="anivia-w"
    transform={`translate(${position.x}, ${position.y}) rotate(${angle * 180 / Math.PI})`}
  >
    <defs>
      <linearGradient id={wallGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b7e8ff" stopOpacity={0.94} />
        <stop offset="38%" stopColor="#6ec5ff" stopOpacity={0.88} />
        <stop offset="100%" stopColor="#2e6bc6" stopOpacity={0.9} />
      </linearGradient>
      <radialGradient id={frostGradientId} cx="50%" cy="50%" r="52%">
        <stop offset="0%" stopColor="#f4fdff" stopOpacity={0.68} />
        <stop offset="58%" stopColor="#b8ecff" stopOpacity={0.24} />
        <stop offset="100%" stopColor="#77c7ff" stopOpacity={0} />
      </radialGradient>
      <pattern id={crackPatternId} width="22" height="36" patternUnits="userSpaceOnUse">
        <path d="M2 3 L9 15 L4 30" fill="none" stroke="rgba(33, 93, 177, 0.35)" strokeWidth="1.1" />
        <path d="M14 2 L19 12 L12 34" fill="none" stroke="rgba(226, 248, 255, 0.24)" strokeWidth="0.9" />
      </pattern>
    </defs>

    <rect x={-width / 2} y={-height / 2} width={width} height={height} rx={3.4} fill={`url(#${wallGradientId})`} stroke="rgba(217, 243, 255, 0.7)" strokeWidth={1.1} />
    <rect x={-width / 2} y={-height / 2} width={width} height={height} rx={3.4} fill={`url(#${crackPatternId})`} opacity={0.45} />
    <rect x={-width / 2} y={-height / 2} width={width} height={height} rx={3.4} fill={`url(#${frostGradientId})`} opacity={0.55} />

    <g className="anivia-w-shards">
      {Array.from({ length: shardCount }).map((_, index) => {
        const y = -height / 2 + shardStep * (index + 1)
        const protrusion = width * (0.18 + (index % 3) * 0.07)
        const shardHalf = shardStep * 0.32
        return (
          <g key={index}>
            <polygon
              points={`${-width / 2},${y - shardHalf} ${-width / 2 - protrusion},${y} ${-width / 2},${y + shardHalf}`}
              fill="rgba(185, 236, 255, 0.62)"
              stroke="rgba(226, 247, 255, 0.5)"
              strokeWidth={0.75}
            />
            <polygon
              points={`${width / 2},${y - shardHalf} ${width / 2 + protrusion},${y} ${width / 2},${y + shardHalf}`}
              fill="rgba(150, 215, 255, 0.58)"
              stroke="rgba(217, 244, 255, 0.45)"
              strokeWidth={0.75}
            />
          </g>
        )
      })}
    </g>

    <polygon
      points={`0,${-height / 2 - 11} ${width * 0.34},${-height / 2} ${-width * 0.34},${-height / 2}`}
      fill="rgba(219, 245, 255, 0.78)"
    />
    <polygon
      points={`0,${height / 2 + 11} ${width * 0.3},${height / 2} ${-width * 0.3},${height / 2}`}
      fill="rgba(133, 203, 255, 0.62)"
    />
  </g >
}

const AniviaQ = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius, direction } = effect
  const rotate = direction ? Math.atan2(direction.y, direction.x) * 180 / Math.PI : 0

  const shellGradientId = effectId(effect, 'q-shell')
  const coreGradientId = effectId(effect, 'q-core')
  const ringGradientId = effectId(effect, 'q-ring')
  const crackGradientId = effectId(effect, 'q-crack')

  const spikeAngles = [-18, 22, 62, 102, 142, 182, 222, 262, 302, 342]

  return <g
    className="anivia-q"
    transform={`translate(${position.x}, ${position.y}) rotate(${rotate})`}
  >
    <defs>
      <radialGradient id={shellGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#d7f4ff" stopOpacity={0.58} />
        <stop offset="58%" stopColor="#6fc8ff" stopOpacity={0.55} />
        <stop offset="100%" stopColor="#2669c4" stopOpacity={0.65} />
      </radialGradient>
      <radialGradient id={coreGradientId} cx="40%" cy="36%" r="65%">
        <stop offset="0%" stopColor="#f6fdff" stopOpacity={0.95} />
        <stop offset="48%" stopColor="#9fe2ff" stopOpacity={0.82} />
        <stop offset="100%" stopColor="#3da4ff" stopOpacity={0.28} />
      </radialGradient>
      <linearGradient id={ringGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(226,247,255,0.92)" />
        <stop offset="100%" stopColor="rgba(130,208,255,0.76)" />
      </linearGradient>
      <linearGradient id={crackGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(160, 228, 255, 0.24)" />
        <stop offset="100%" stopColor="rgba(232, 250, 255, 0.78)" />
      </linearGradient>
    </defs>

    <circle className="anivia-q-shell" r={radius} fill={`url(#${shellGradientId})`} />
    <circle r={radius * 0.64} fill={`url(#${coreGradientId})`} />
    <circle r={radius * 0.92} fill="none" stroke={`url(#${ringGradientId})`} strokeWidth={1.45} />

    <g className="anivia-q-spikes">
      {spikeAngles.map((angle, index) => {
        const p1 = toPolar(radius * 0.5, angle - 9)
        const p2 = toPolar(radius * (1.02 + (index % 2) * 0.08), angle)
        const p3 = toPolar(radius * 0.52, angle + 9)
        return (
          <polygon
            key={index}
            points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
            fill="rgba(188, 237, 255, 0.62)"
            stroke="rgba(236, 251, 255, 0.64)"
            strokeWidth={0.65}
          />
        )
      })}
    </g>

    {Array.from({ length: 6 }).map((_, index) => {
      const angle = index * 60
      const from = toPolar(radius * 0.18, angle)
      const to = toPolar(radius * 0.84, angle + (index % 2 === 0 ? 7 : -7))
      return (
        <line
          key={index}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={`url(#${crackGradientId})`}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      )
    })}
  </g >
}

export { AniviaQ, AniviaW };
