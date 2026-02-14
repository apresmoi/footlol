import React from 'react';
import { CircleEffect } from '../../../../store/types';
import './styles.scss'

const effectId = (effect: CircleEffect, suffix: string) => {
  const fallback = `${Math.round(effect.position.x)}-${Math.round(effect.position.y)}`
  return `lucian-w-${suffix}-${effect.instanceId || fallback}`
}

const LucianW = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, direction } = effect
  const rotate = Math.atan2(direction.y, direction.x) * 180 / Math.PI

  const shellGradientId = effectId(effect, 'shell')
  const coreGradientId = effectId(effect, 'core')
  const flareGradientId = effectId(effect, 'flare')

  const beamLength = 88
  const outerHalfWidth = 10
  const coreHalfWidth = 4.5

  return <g
    className="lucian-w"
    transform={`translate(${position.x}, ${position.y}) rotate(${rotate})`}
  >
    <defs>
      <linearGradient id={shellGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0f4ca8" stopOpacity={0.05} />
        <stop offset="45%" stopColor="#1f78dd" stopOpacity={0.35} />
        <stop offset="78%" stopColor="#7bc6ff" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#ecfbff" stopOpacity={0.98} />
      </linearGradient>
      <linearGradient id={coreGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a8e4ff" stopOpacity={0.16} />
        <stop offset="52%" stopColor="#d8f5ff" stopOpacity={0.62} />
        <stop offset="88%" stopColor="#ffffff" stopOpacity={1} />
        <stop offset="100%" stopColor="#fffbe8" stopOpacity={1} />
      </linearGradient>
      <radialGradient id={flareGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ceefff" stopOpacity={0.72} />
        <stop offset="55%" stopColor="#88c9f8" stopOpacity={0.28} />
        <stop offset="100%" stopColor="#2e77cf" stopOpacity={0} />
      </radialGradient>
    </defs>

    <ellipse cx={-26} cy={0} rx={28} ry={12} fill={`url(#${flareGradientId})`} />

    <path
      d={`M-${beamLength} 0
          C-${beamLength * 0.44} -${outerHalfWidth * 1.05}, -14 -${outerHalfWidth * 0.95}, 14 -${outerHalfWidth * 0.75}
          L52 0
          L14 ${outerHalfWidth * 0.75}
          C-14 ${outerHalfWidth * 0.95}, -${beamLength * 0.44} ${outerHalfWidth * 1.05}, -${beamLength} 0 Z`}
      fill={`url(#${shellGradientId})`}
      stroke="rgba(206, 244, 255, 0.34)"
      strokeWidth={0.8}
    />

    <path
      d={`M-${beamLength * 0.95} 0
          C-${beamLength * 0.5} -${coreHalfWidth}, -10 -${coreHalfWidth * 0.75}, 20 -${coreHalfWidth * 0.66}
          L58 0
          L20 ${coreHalfWidth * 0.66}
          C-10 ${coreHalfWidth * 0.75}, -${beamLength * 0.5} ${coreHalfWidth}, -${beamLength * 0.95} 0 Z`}
      fill={`url(#${coreGradientId})`}
      opacity={0.96}
    />

    <path d="M-14 -6 C4 -11, 22 -8, 44 -3" fill="none" stroke="rgba(205, 238, 255, 0.52)" strokeWidth={1.2} strokeLinecap="round" />
    <path d="M-14 6 C4 11, 22 8, 44 3" fill="none" stroke="rgba(205, 238, 255, 0.52)" strokeWidth={1.2} strokeLinecap="round" />
    <circle cx={56} cy={0} r={2.6} fill="rgba(255, 255, 255, 0.95)" />
  </g >
}

export { LucianW };
