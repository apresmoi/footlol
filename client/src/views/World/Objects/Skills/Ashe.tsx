import React from 'react';
import { CircleEffect } from '../../../../store/types';
import './styles.scss'

const effectId = (effect: CircleEffect, suffix: string) => {
  const fallback = `${Math.round(effect.position.x)}-${Math.round(effect.position.y)}`
  return `ashe-${suffix}-${effect.instanceId || fallback}`
}

const AsheW = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, direction } = effect
  const rotate = direction ? Math.atan2(direction.y, direction.x) * 180 / Math.PI : 0
  const trailGradientId = effectId(effect, 'w-trail')
  const bodyGradientId = effectId(effect, 'w-body')
  const coreGradientId = effectId(effect, 'w-core')
  const runeGradientId = effectId(effect, 'w-rune')
  const edgeGradientId = effectId(effect, 'w-edge')
  const flareGradientId = effectId(effect, 'w-flare')

  return <g
    className="ashe-w"
    transform={`translate(${position.x}, ${position.y}) rotate(${rotate})`}
  >
    <defs>
      <linearGradient id={trailGradientId} x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#7bc9f1" stopOpacity={0} />
        <stop offset="68%" stopColor="#9fe2ff" stopOpacity={0.48} />
        <stop offset="100%" stopColor="#ecfbff" stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id={bodyGradientId} x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#61bee9" stopOpacity={0.24} />
        <stop offset="58%" stopColor="#7fd7ff" stopOpacity={0.78} />
        <stop offset="100%" stopColor="#b9ecff" stopOpacity={0.96} />
      </linearGradient>
      <linearGradient id={coreGradientId} x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#8fd8f8" stopOpacity={0.14} />
        <stop offset="54%" stopColor="#d9f6ff" stopOpacity={0.74} />
        <stop offset="100%" stopColor="#f8fdff" stopOpacity={1} />
      </linearGradient>
      <linearGradient id={runeGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93e0ff" stopOpacity={0.92} />
        <stop offset="60%" stopColor="#53bfff" stopOpacity={0.78} />
        <stop offset="100%" stopColor="#b6f0ff" stopOpacity={0.96} />
      </linearGradient>
      <linearGradient id={edgeGradientId} x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#b8ebff" stopOpacity={0.3} />
        <stop offset="64%" stopColor="#ebfbff" stopOpacity={0.88} />
        <stop offset="100%" stopColor="#ffffff" stopOpacity={0.98} />
      </linearGradient>
      <radialGradient id={flareGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f8fdff" stopOpacity={0.94} />
        <stop offset="100%" stopColor="#88d7ff" stopOpacity={0} />
      </radialGradient>
    </defs>

    <ellipse className="ashe-w-trail" cx={-36} cy={0} rx={54} ry={9} fill={`url(#${trailGradientId})`} />

    <path
      className="ashe-w-body"
      d="M-96 0 C-78 -8 -49 -8 -11 -5 L22 -5 L38 -13 L65 0 L38 13 L22 5 L-11 5 C-49 8 -78 8 -96 0 Z"
      fill={`url(#${bodyGradientId})`}
    />
    <path
      className="ashe-w-core"
      d="M-90 0 C-67 -4 -43 -4 -11 -2.5 L25 -2.5 L44 0 L25 2.5 L-11 2.5 C-43 4 -67 4 -90 0 Z"
      fill={`url(#${coreGradientId})`}
    />

    <path
      className="ashe-w-edge"
      d="M-96 0 C-78 -8 -49 -8 -11 -5 L22 -5 L38 -13 L65 0 L38 13 L22 5 L-11 5 C-49 8 -78 8 -96 0 Z"
      fill="none"
      stroke={`url(#${edgeGradientId})`}
      strokeWidth={1.1}
    />

    <polygon className="ashe-w-rune" points="-34,-8 -22,0 -34,8 -46,0" fill={`url(#${runeGradientId})`} />
    <polygon className="ashe-w-rune" points="2,-9 15,0 2,9 -11,0" fill={`url(#${runeGradientId})`} />
    <polygon className="ashe-w-rune-core" points="-34,-3 -29,0 -34,3 -39,0" fill="rgba(233,250,255,0.9)" />
    <polygon className="ashe-w-rune-core" points="2,-3.5 8,0 2,3.5 -4,0" fill="rgba(233,250,255,0.9)" />

    <polygon className="ashe-w-head" points="38,-13 72,0 38,13 50,0" fill={`url(#${runeGradientId})`} />
    <polygon className="ashe-w-head-core" points="42,-7 61,0 42,7 50,0" fill="rgba(237,251,255,0.92)" />

    <ellipse className="ashe-w-flare" cx={69} cy={0} rx={9.2} ry={5.2} fill={`url(#${flareGradientId})`} />
  </g >
}

const AsheQ = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, direction, radius } = effect
  const rotate = direction ? Math.atan2(direction.y, direction.x) * 180 / Math.PI : 0

  const trailGradientId = effectId(effect, 'q-trail')
  const hazeGradientId = effectId(effect, 'q-haze')
  const shaftGradientId = effectId(effect, 'q-shaft')
  const tipGradientId = effectId(effect, 'q-tip')
  const sparkleGradientId = effectId(effect, 'q-spark')
  const arrowLength = Math.max(14, (radius || 7) * 2.2)

  return <g
    className="ashe-q"
    transform={`translate(${position.x}, ${position.y}) rotate(${rotate})`}
  >
    <defs>
      <linearGradient id={trailGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f4fdff" stopOpacity={0.03} />
        <stop offset="75%" stopColor="#b8ebff" stopOpacity={0.6} />
        <stop offset="100%" stopColor="#f6feff" stopOpacity={0.95} />
      </linearGradient>
      <radialGradient id={hazeGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#dbf6ff" stopOpacity={0.45} />
        <stop offset="64%" stopColor="#91dfff" stopOpacity={0.24} />
        <stop offset="100%" stopColor="#63beff" stopOpacity={0} />
      </radialGradient>
      <linearGradient id={shaftGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f6feff" stopOpacity={0.16} />
        <stop offset="72%" stopColor="#a6e4ff" stopOpacity={0.92} />
        <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
      </linearGradient>
      <linearGradient id={tipGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#d0f3ff" stopOpacity={0.78} />
        <stop offset="62%" stopColor="#ecfbff" stopOpacity={1} />
        <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
      </linearGradient>
      <radialGradient id={sparkleGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
        <stop offset="58%" stopColor="#c5f0ff" stopOpacity={0.72} />
        <stop offset="100%" stopColor="#7fd3ff" stopOpacity={0} />
      </radialGradient>
    </defs>

    <ellipse cx={-arrowLength * 0.4} cy={0} rx={arrowLength * 0.34} ry={4.8} fill={`url(#${hazeGradientId})`} />

    <path
      d={`M-${arrowLength} 0 C-${arrowLength * 0.48} -3.4, -8 -2.7, 5 -2.1 L12 0 L5 2.1 C-8 2.7, -${arrowLength * 0.48} 3.4, -${arrowLength} 0 Z`}
      fill={`url(#${trailGradientId})`}
      opacity={0.88}
    />

    <path
      d={`M-${arrowLength * 0.84} -1.45 L-5.4 -1.45 L-2.7 -3.2 L8.3 0 L-2.7 3.2 L-5.4 1.45 L-${arrowLength * 0.84} 1.45 Z`}
      fill={`url(#${shaftGradientId})`}
      opacity={0.95}
    />

    <path d="M7 -3.9 L15 0 L7 3.9 L10.2 0 Z" fill={`url(#${tipGradientId})`} />

    <path d="M-17 -2.4 L-8 -7.6" stroke="rgba(239, 252, 255, 0.84)" strokeWidth={0.95} strokeLinecap="round" />
    <path d="M-17 2.4 L-8 7.6" stroke="rgba(239, 252, 255, 0.84)" strokeWidth={0.95} strokeLinecap="round" />

    <g transform="translate(17, 0)">
      <circle cx={0} cy={0} r={3.2} fill={`url(#${sparkleGradientId})`} />
      <line x1={-5.1} y1={0} x2={5.1} y2={0} stroke="rgba(233, 250, 255, 0.78)" strokeWidth={1.05} strokeLinecap="round" />
      <line x1={0} y1={-5.1} x2={0} y2={5.1} stroke="rgba(233, 250, 255, 0.78)" strokeWidth={1.05} strokeLinecap="round" />
      <line x1={-3.6} y1={-3.6} x2={3.6} y2={3.6} stroke="rgba(212, 246, 255, 0.62)" strokeWidth={0.9} strokeLinecap="round" />
      <line x1={3.6} y1={-3.6} x2={-3.6} y2={3.6} stroke="rgba(212, 246, 255, 0.62)" strokeWidth={0.9} strokeLinecap="round" />
    </g>
  </g >
}

export { AsheQ, AsheW };
