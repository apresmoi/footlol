import React from 'react';
import { RectEffect } from '../../../../store/types';
import './styles.scss'

const effectId = (effect: RectEffect, suffix: string) => {
  const fallback = `${Math.round(effect.position.x)}-${Math.round(effect.position.y)}`
  return `garen-w-${suffix}-${effect.instanceId || fallback}`
}

const GarenW = (props: { effect: RectEffect }) => {
  const { effect } = props
  const { position, width, height, angle } = effect
  const ringRadius = Math.max(height * 0.52, width * 4, 34)
  const innerRadius = ringRadius * 0.78
  const circumference = 2 * Math.PI * ringRadius
  const longDash = circumference * 0.2
  const midDash = circumference * 0.14
  const shortDash = circumference * 0.1
  const swordLength = innerRadius * 1.26
  const bladeHalfWidth = Math.max(4.6, innerRadius * 0.13)
  const guardHalfWidth = bladeHalfWidth * 1.8
  const hiltLength = innerRadius * 0.24

  const glowId = effectId(effect, 'glow')
  const ringId = effectId(effect, 'ring')
  const innerRingId = effectId(effect, 'inner-ring')
  const trailId = effectId(effect, 'trail')
  const spiralId = effectId(effect, 'spiral')
  const windId = effectId(effect, 'wind')
  const bladeMetalId = effectId(effect, 'blade-metal')
  const bladeSheenId = effectId(effect, 'blade-sheen')

  return <g
    className="garen-w"
    transform={`translate(${position.x}, ${position.y}) rotate(${angle * 180 / Math.PI})`}
  >
    <defs>
      <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffd66f" stopOpacity={0.52} />
        <stop offset="58%" stopColor="#e7b944" stopOpacity={0.28} />
        <stop offset="100%" stopColor="#b67a1f" stopOpacity={0} />
      </radialGradient>
      <radialGradient id={ringId} cx="50%" cy="50%" r="50%">
        <stop offset="74%" stopColor="#ffe7a3" stopOpacity={0} />
        <stop offset="86%" stopColor="#ffd76f" stopOpacity={0.75} />
        <stop offset="100%" stopColor="#c98a22" stopOpacity={0.96} />
      </radialGradient>
      <radialGradient id={innerRingId} cx="50%" cy="50%" r="50%">
        <stop offset="64%" stopColor="#fff8d9" stopOpacity={0} />
        <stop offset="84%" stopColor="#fff3c8" stopOpacity={0.38} />
        <stop offset="100%" stopColor="#e7c36f" stopOpacity={0.58} />
      </radialGradient>
      <linearGradient id={trailId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fff3bf" stopOpacity={0.08} />
        <stop offset="46%" stopColor="#ffeaa8" stopOpacity={0.95} />
        <stop offset="100%" stopColor="#c8851f" stopOpacity={0.22} />
      </linearGradient>
      <linearGradient id={spiralId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff9dd" stopOpacity={0.12} />
        <stop offset="40%" stopColor="#ffe8a3" stopOpacity={0.84} />
        <stop offset="100%" stopColor="#c98b24" stopOpacity={0.15} />
      </linearGradient>
      <linearGradient id={windId} x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#fff4be" stopOpacity={0.05} />
        <stop offset="42%" stopColor="#fff1c2" stopOpacity={0.7} />
        <stop offset="100%" stopColor="#cd8f2b" stopOpacity={0.1} />
      </linearGradient>
      <linearGradient id={bladeMetalId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6f7f8f" stopOpacity={0.96} />
        <stop offset="22%" stopColor="#bac5d2" stopOpacity={0.98} />
        <stop offset="50%" stopColor="#f3f7fc" stopOpacity={1} />
        <stop offset="78%" stopColor="#adb9c6" stopOpacity={0.98} />
        <stop offset="100%" stopColor="#667483" stopOpacity={0.95} />
      </linearGradient>
      <linearGradient id={bladeSheenId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.02} />
        <stop offset="52%" stopColor="#ffffff" stopOpacity={0.74} />
        <stop offset="100%" stopColor="#ffffff" stopOpacity={0.04} />
      </linearGradient>
    </defs>

    <ellipse className="garen-w-ground" cx={0} cy={0} rx={ringRadius * 1.02} ry={ringRadius * 0.9} fill={`url(#${glowId})`} />

    <circle className="garen-w-ring-outer" cx={0} cy={0} r={ringRadius} fill={`url(#${ringId})`} />
    <circle className="garen-w-ring-core" cx={0} cy={0} r={ringRadius * 0.88} fill="none" stroke="#ffe89f" strokeOpacity={0.84} strokeWidth={2.2} />
    <circle className="garen-w-ring-inner" cx={0} cy={0} r={innerRadius} fill={`url(#${innerRingId})`} />

    <g className="garen-w-spin">
      <circle
        className="garen-w-trail garen-w-trail-major"
        cx={0}
        cy={0}
        r={ringRadius * 0.95}
        fill="none"
        stroke={`url(#${trailId})`}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={`${longDash} ${circumference}`}
      />
      <circle
        className="garen-w-trail garen-w-trail-mid"
        cx={0}
        cy={0}
        r={ringRadius * 0.78}
        fill="none"
        stroke={`url(#${trailId})`}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${midDash} ${circumference}`}
        strokeDashoffset={-circumference * 0.22}
      />
      <circle
        className="garen-w-trail garen-w-trail-small"
        cx={0}
        cy={0}
        r={ringRadius * 0.62}
        fill="none"
        stroke={`url(#${trailId})`}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeDasharray={`${shortDash} ${circumference}`}
        strokeDashoffset={-circumference * 0.44}
      />
      <path
        className="garen-w-sword-wash"
        d={`M ${-innerRadius * 0.18} ${-innerRadius * 0.08}
            C ${innerRadius * 0.12} ${-innerRadius * 0.36}, ${innerRadius * 0.58} ${-innerRadius * 0.32}, ${innerRadius * 1.08} ${0}
            C ${innerRadius * 0.58} ${innerRadius * 0.32}, ${innerRadius * 0.12} ${innerRadius * 0.36}, ${-innerRadius * 0.18} ${innerRadius * 0.08}
            C ${innerRadius * 0.02} ${innerRadius * 0.03}, ${innerRadius * 0.02} ${-innerRadius * 0.03}, ${-innerRadius * 0.18} ${-innerRadius * 0.08} Z`}
        fill={`url(#${trailId})`}
      />
      <path
        className="garen-w-sword-wash-back"
        d={`M ${innerRadius * 0.1} ${-innerRadius * 0.05}
            C ${-innerRadius * 0.24} ${-innerRadius * 0.25}, ${-innerRadius * 0.72} ${-innerRadius * 0.2}, ${-innerRadius * 1.02} ${0}
            C ${-innerRadius * 0.72} ${innerRadius * 0.2}, ${-innerRadius * 0.24} ${innerRadius * 0.25}, ${innerRadius * 0.1} ${innerRadius * 0.05}
            C ${-innerRadius * 0.02} ${innerRadius * 0.02}, ${-innerRadius * 0.02} ${-innerRadius * 0.02}, ${innerRadius * 0.1} ${-innerRadius * 0.05} Z`}
        fill={`url(#${trailId})`}
      />
    </g>

    <g className="garen-w-weapon">
      <path
        className="garen-w-wind-primary"
        d={`M ${-innerRadius * 0.12} ${-innerRadius * 0.12}
            C ${innerRadius * 0.16} ${-innerRadius * 0.58}, ${innerRadius * 0.7} ${-innerRadius * 0.56}, ${innerRadius * 1.2} ${-innerRadius * 0.08}
            C ${innerRadius * 0.82} ${innerRadius * 0.02}, ${innerRadius * 0.38} ${innerRadius * 0.04}, ${-innerRadius * 0.12} ${-innerRadius * 0.12} Z`}
        fill={`url(#${windId})`}
      />
      <path
        className="garen-w-wind-secondary"
        d={`M ${-innerRadius * 0.06} ${innerRadius * 0.1}
            C ${innerRadius * 0.24} ${-innerRadius * 0.24}, ${innerRadius * 0.64} ${-innerRadius * 0.22}, ${innerRadius * 0.98} ${innerRadius * 0.05}
            C ${innerRadius * 0.62} ${innerRadius * 0.24}, ${innerRadius * 0.22} ${innerRadius * 0.28}, ${-innerRadius * 0.06} ${innerRadius * 0.1} Z`}
        fill={`url(#${windId})`}
      />
      <path
        className="garen-w-blade"
        d={`M ${hiltLength * 0.1} ${-bladeHalfWidth}
            L ${swordLength * 0.88} ${-bladeHalfWidth * 0.75}
            L ${swordLength} 0
            L ${swordLength * 0.88} ${bladeHalfWidth * 0.75}
            L ${hiltLength * 0.1} ${bladeHalfWidth} Z`}
        fill={`url(#${bladeMetalId})`}
        stroke="rgba(24, 29, 35, 0.74)"
        strokeWidth={1.05}
      />
      <path
        className="garen-w-blade-core"
        d={`M ${hiltLength * 0.22} 0 L ${swordLength * 0.92} 0`}
        stroke="rgba(255, 255, 246, 0.95)"
        strokeWidth={1.3}
      />
      <path
        className="garen-w-blade-sheen"
        d={`M ${hiltLength * 0.26} ${-bladeHalfWidth * 0.22}
            C ${swordLength * 0.46} ${-bladeHalfWidth * 0.34}, ${swordLength * 0.72} ${-bladeHalfWidth * 0.18}, ${swordLength * 0.9} ${-bladeHalfWidth * 0.08}`}
        fill="none"
        stroke={`url(#${bladeSheenId})`}
        strokeWidth={1.05}
        strokeLinecap="round"
      />
      <rect
        className="garen-w-guard"
        x={-hiltLength * 0.16}
        y={-guardHalfWidth * 0.42}
        width={hiltLength * 0.5}
        height={guardHalfWidth * 0.84}
        rx={guardHalfWidth * 0.2}
        fill="#dbb75e"
        stroke="rgba(32, 24, 16, 0.68)"
        strokeWidth={0.9}
      />
      <rect
        className="garen-w-hilt"
        x={-hiltLength * 0.42}
        y={-bladeHalfWidth * 0.44}
        width={hiltLength * 0.32}
        height={bladeHalfWidth * 0.88}
        rx={bladeHalfWidth * 0.22}
        fill="#8e6028"
      />
      <circle
        className="garen-w-pommel"
        cx={-hiltLength * 0.46}
        cy={0}
        r={bladeHalfWidth * 0.36}
        fill="#dfbd68"
        stroke="rgba(42, 30, 20, 0.62)"
        strokeWidth={0.7}
      />
    </g>

    <g className="garen-w-spiral">
      {[0, 180].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path
            className="garen-w-spiral-line"
            d={`M ${-innerRadius * 0.82} 0
                C ${-innerRadius * 0.42} ${-innerRadius * 0.54}, ${innerRadius * 0.22} ${-innerRadius * 0.46}, ${innerRadius * 0.8} 0`}
            fill="none"
            stroke={`url(#${spiralId})`}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>

    <circle className="garen-w-center-glow" cx={0} cy={0} r={innerRadius * 0.44} fill="rgba(255, 232, 153, 0.18)" />
  </g >
}

export { GarenW };
