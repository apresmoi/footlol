import React from 'react';
import { CircleEffect } from '../../../../store/types';
import './styles.scss'

const toPolar = (distance: number, angleDeg: number) => {
  const angle = angleDeg * Math.PI / 180
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance }
}

const effectId = (effect: CircleEffect, suffix: string) => {
  const fallback = `${Math.round(effect.position.x)}-${Math.round(effect.position.y)}-${Math.round(effect.radius)}`
  return `malphite-${suffix}-${effect.instanceId || fallback}`
}

const MalphiteW = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius } = effect

  const dustGradientId = effectId(effect, 'w-dust')
  const rockPatternId = effectId(effect, 'w-rock')
  const clipId = effectId(effect, 'w-clip')

  const crackAngles = [12, 55, 92, 138, 188, 224, 272, 315]

  return <g
    className="malphite-w"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <defs>
      <radialGradient id={dustGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#4a3a31" stopOpacity={0.08} />
        <stop offset="45%" stopColor="#6f5641" stopOpacity={0.22} />
        <stop offset="100%" stopColor="#2a201b" stopOpacity={0.55} />
      </radialGradient>
      <pattern id={rockPatternId} width="32" height="32" patternUnits="userSpaceOnUse">
        <rect width="32" height="32" fill="rgba(56, 43, 36, 0.18)" />
        <path d="M2 8 L11 4 L16 12 L9 17 Z" fill="rgba(120, 96, 76, 0.28)" />
        <path d="M18 3 L27 6 L24 15 L15 11 Z" fill="rgba(89, 70, 57, 0.3)" />
        <path d="M4 23 L12 19 L18 27 L8 30 Z" fill="rgba(133, 109, 86, 0.22)" />
        <path d="M20 20 L29 19 L30 30 L21 29 Z" fill="rgba(70, 55, 46, 0.35)" />
      </pattern>
      <clipPath id={clipId}>
        <circle cx={0} cy={0} r={radius} />
      </clipPath>
    </defs>

    <circle cx={0} cy={0} r={radius} fill={`url(#${dustGradientId})`} />
    <circle cx={0} cy={0} r={radius * 0.95} fill={`url(#${rockPatternId})`} opacity={0.52} clipPath={`url(#${clipId})`} />
    <circle cx={0} cy={0} r={radius} fill="transparent" stroke="rgba(212, 165, 116, 0.26)" strokeWidth={1.8} />
    <circle cx={0} cy={0} r={radius * 0.7} fill="transparent" stroke="rgba(97, 75, 59, 0.32)" strokeWidth={1.3} />

    {crackAngles.map((angle, index) => {
      const from = toPolar(radius * 0.18, angle)
      const mid = toPolar(radius * 0.62, angle + (index % 2 === 0 ? 8 : -7))
      const to = toPolar(radius * 0.94, angle + (index % 2 === 0 ? -5 : 6))
      return (
        <path
          key={index}
          d={`M${from.x},${from.y} L${mid.x},${mid.y} L${to.x},${to.y}`}
          fill="none"
          stroke="rgba(25, 18, 14, 0.55)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      )
    })}
  </g>
}

const MalphiteQ = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius, direction } = effect
  const rotate = direction ? Math.atan2(direction.y, direction.x) * 180 / Math.PI : 0

  const dustGradientId = effectId(effect, 'q-dust')
  const shardGradientId = effectId(effect, 'q-shard')

  const shardAngles = [-48, -18, 14, 43, 76, 116, 154, 196]

  return <g
    className="malphite-q"
    transform={`translate(${position.x}, ${position.y}) rotate(${rotate})`}
  >
    <defs>
      <radialGradient id={dustGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#b69066" stopOpacity={0.08} />
        <stop offset="60%" stopColor="#7f5f3f" stopOpacity={0.24} />
        <stop offset="100%" stopColor="#3f2f23" stopOpacity={0.42} />
      </radialGradient>
      <linearGradient id={shardGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#caa277" stopOpacity={0.65} />
        <stop offset="100%" stopColor="#5f442e" stopOpacity={0.55} />
      </linearGradient>
    </defs>

    <ellipse cx={radius * 0.28} cy={0} rx={radius * 1.06} ry={radius * 0.82} fill={`url(#${dustGradientId})`} />
    <circle cx={0} cy={0} r={radius * 0.8} fill={`url(#${dustGradientId})`} opacity={0.65} />

    {shardAngles.map((angle, index) => {
      const p1 = toPolar(radius * 0.22, angle)
      const p2 = toPolar(radius * (0.74 + (index % 3) * 0.09), angle + 4)
      const p3 = toPolar(radius * (0.58 + (index % 2) * 0.12), angle - 7)
      return (
        <polygon
          key={index}
          points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
          fill={`url(#${shardGradientId})`}
          opacity={0.62}
          stroke="rgba(28, 20, 16, 0.45)"
          strokeWidth={0.8}
        />
      )
    })}

    {shardAngles.map((angle, index) => {
      const from = toPolar(radius * 0.1, angle)
      const to = toPolar(radius * 0.92, angle + (index % 2 === 0 ? 5 : -4))
      return (
        <line
          key={`c-${index}`}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="rgba(23, 16, 12, 0.52)"
          strokeWidth={1.35}
          strokeLinecap="round"
        />
      )
    })}
  </g>
}

export { MalphiteQ, MalphiteW };
