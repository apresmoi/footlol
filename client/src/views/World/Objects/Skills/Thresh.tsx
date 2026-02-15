import React from 'react';
import { VectorEffect } from '../../../../store/types';
import './styles.scss'

const ThreshW = (props: { effect: VectorEffect }) => {
  const { effect } = props
  const { position, to, radius } = effect
  const dx = position.x - to.x
  const dy = position.y - to.y
  const seed = effect.instanceId || `${Math.round(position.x)}-${Math.round(position.y)}-${Math.round(to.x)}-${Math.round(to.y)}`
  const beamGradientId = `thresh-w-beam-${seed}`
  const beamCoreId = `thresh-w-core-${seed}`
  const bubbleStrokeId = `thresh-w-bubble-${seed}`
  const bubbleFillId = `thresh-w-bubble-fill-${seed}`
  const lanternGemId = `thresh-w-gem-${seed}`
  const glowId = `thresh-w-glow-${seed}`
  const bubbleRadius = Math.max(radius * 1.4, 20)

  return <g
    className="thresh-w"
    transform={`translate(${to.x}, ${to.y})`}
  >
    <defs>
      <linearGradient id={beamGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(133, 244, 255, 0.58)" />
        <stop offset="60%" stopColor="rgba(143, 233, 255, 0.46)" />
        <stop offset="100%" stopColor="rgba(163, 233, 255, 0.36)" />
      </linearGradient>
      <linearGradient id={beamCoreId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(238, 255, 255, 0.74)" />
        <stop offset="100%" stopColor="rgba(238, 255, 255, 0.38)" />
      </linearGradient>
      <radialGradient id={bubbleStrokeId} cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="rgba(161, 241, 255, 0.9)" />
        <stop offset="100%" stopColor="rgba(123, 206, 255, 0.35)" />
      </radialGradient>
      <radialGradient id={bubbleFillId} cx="50%" cy="44%" r="60%">
        <stop offset="0%" stopColor="rgba(130, 226, 255, 0.32)" />
        <stop offset="100%" stopColor="rgba(69, 156, 213, 0.08)" />
      </radialGradient>
      <radialGradient id={lanternGemId} cx="50%" cy="46%" r="60%">
        <stop offset="0%" stopColor="#9df8d6" stopOpacity={0.98} />
        <stop offset="60%" stopColor="#4ddcb4" stopOpacity={0.86} />
        <stop offset="100%" stopColor="#246c68" stopOpacity={0.72} />
      </radialGradient>
      <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(180, 255, 255, 0.95)" />
        <stop offset="100%" stopColor="rgba(180, 255, 255, 0)" />
      </radialGradient>
    </defs>

    <line className="thresh-w-beam-outer" x2={dx} y2={dy} stroke={`url(#${beamGradientId})`} strokeWidth={Math.max(4.8, radius * 0.34)} strokeLinecap="round" />
    <line className="thresh-w-beam-inner" x2={dx} y2={dy} stroke={`url(#${beamCoreId})`} strokeWidth={Math.max(2.2, radius * 0.15)} strokeLinecap="round" />

    <circle className="thresh-w-bubble-fill" r={bubbleRadius} fill={`url(#${bubbleFillId})`} />
    <circle className="thresh-w-bubble-edge" r={bubbleRadius} fill="none" stroke={`url(#${bubbleStrokeId})`} strokeWidth={1.8} />
    <circle className="thresh-w-bubble-inner" r={bubbleRadius * 0.73} fill="none" stroke="rgba(187, 247, 255, 0.38)" strokeWidth={1} />
    <circle className="thresh-w-lantern-glow" r={radius * 1.05} fill={`url(#${glowId})`} />

    <g transform="rotate(45)">
      <rect x={-radius * 0.62} y={-radius * 0.62} width={radius * 1.24} height={radius * 1.24} rx={2.6} fill="rgba(16, 35, 43, 0.86)" stroke="rgba(138, 236, 247, 0.72)" strokeWidth={1.4} />
      <rect x={-radius * 0.34} y={-radius * 0.34} width={radius * 0.68} height={radius * 0.68} rx={2} fill={`url(#${lanternGemId})`} stroke="rgba(189, 253, 232, 0.82)" strokeWidth={0.8} />
      <circle r={radius * 0.12} fill="rgba(240, 255, 250, 0.92)" />
    </g>

    {[0, 120, 240].map((angle, index) => (
      <circle
        key={index}
        className="thresh-w-particle"
        cx={Math.cos(angle * Math.PI / 180) * bubbleRadius * 0.52}
        cy={Math.sin(angle * Math.PI / 180) * bubbleRadius * 0.52}
        r={1.25}
      />
    ))}
  </g>
}

const ThreshQ = (props: { effect: VectorEffect }) => {
  const { effect } = props
  const { position, to, radius } = effect
  const dx = position.x - to.x
  const dy = position.y - to.y
  const length = Math.hypot(dx, dy)
  const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI
  const headAngle = angleDeg + 180
  const seed = effect.instanceId || `${Math.round(position.x)}-${Math.round(position.y)}-${Math.round(to.x)}-${Math.round(to.y)}`
  const chainOuterId = `thresh-q-chain-outer-${seed}`
  const chainCoreId = `thresh-q-chain-core-${seed}`
  const hookGradientId = `thresh-q-hook-${seed}`
  const hookCoreId = `thresh-q-hook-core-${seed}`
  const tipGlowId = `thresh-q-tip-${seed}`
  const chainLinks = Math.max(7, Math.round(length / 24))
  const linkSize = Math.max(2.6, radius * 0.22)

  const hookOuter = Math.max(radius * 1.55, 10)
  const hookInner = hookOuter * 0.56
  const hookPath = `
    M ${hookOuter * 0.2} ${-hookOuter}
    A ${hookOuter} ${hookOuter} 0 1 1 ${hookOuter * 0.2} ${hookOuter}
    L ${hookInner * 0.55} ${hookInner * 0.72}
    A ${hookInner} ${hookInner} 0 1 0 ${hookInner * 0.55} ${-hookInner * 0.72}
    Z
  `

  return <g
    className="thresh-q"
    transform={`translate(${to.x}, ${to.y})`}
  >
    <defs>
      <linearGradient id={chainOuterId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(128, 246, 227, 0.92)" />
        <stop offset="100%" stopColor="rgba(92, 213, 193, 0.62)" />
      </linearGradient>
      <linearGradient id={chainCoreId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(210, 255, 245, 0.9)" />
        <stop offset="100%" stopColor="rgba(186, 252, 240, 0.44)" />
      </linearGradient>
      <linearGradient id={hookGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(125, 240, 214, 0.96)" />
        <stop offset="55%" stopColor="rgba(69, 188, 170, 0.88)" />
        <stop offset="100%" stopColor="rgba(34, 90, 94, 0.92)" />
      </linearGradient>
      <radialGradient id={hookCoreId} cx="48%" cy="42%" r="58%">
        <stop offset="0%" stopColor="rgba(216, 255, 245, 0.95)" />
        <stop offset="100%" stopColor="rgba(216, 255, 245, 0)" />
      </radialGradient>
      <radialGradient id={tipGlowId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(199, 255, 241, 0.98)" />
        <stop offset="100%" stopColor="rgba(199, 255, 241, 0)" />
      </radialGradient>
    </defs>

    <line className="thresh-q-chain-outer" x2={dx} y2={dy} stroke={`url(#${chainOuterId})`} strokeWidth={Math.max(3.4, radius * 0.25)} strokeLinecap="round" />
    <line className="thresh-q-chain-inner" x2={dx} y2={dy} stroke={`url(#${chainCoreId})`} strokeWidth={Math.max(1.45, radius * 0.11)} strokeLinecap="round" />

    <g className="thresh-q-links">
      {Array.from({ length: chainLinks }).map((_, index) => {
        const t = (index + 1) / (chainLinks + 1)
        const x = dx * t
        const y = dy * t
        const size = linkSize * (0.95 + (index % 2) * 0.2)
        return (
          <g key={index} className="thresh-q-link" transform={`translate(${x}, ${y}) rotate(${angleDeg})`}>
            <polygon
              points={`${-size},0 0,${-size * 0.52} ${size},0 0,${size * 0.52}`}
              fill="rgba(132, 233, 213, 0.92)"
              stroke="rgba(198, 255, 243, 0.74)"
              strokeWidth={0.4}
            />
          </g>
        )
      })}
    </g>

    <g transform={`rotate(${headAngle})`}>
      <path className="thresh-q-hook" d={hookPath} fill={`url(#${hookGradientId})`} />
      <path className="thresh-q-hook-core" d={hookPath} fill={`url(#${hookCoreId})`} />
      <polygon
        points={`${hookOuter * 0.92},0 ${hookOuter * 1.35},${-hookOuter * 0.18} ${hookOuter * 1.35},${hookOuter * 0.18}`}
        fill="rgba(117, 240, 217, 0.94)"
        stroke="rgba(205, 255, 245, 0.76)"
        strokeWidth={0.42}
      />
      <circle className="thresh-q-tip-glow" cx={hookOuter * 1.2} cy={0} r={hookOuter * 0.5} fill={`url(#${tipGlowId})`} />
    </g>
  </g>
}

export { ThreshQ, ThreshW };
