import React from 'react';
import { RingEffect, CircleEffect } from '../../../../store/types';
import './styles.scss'

const effectId = (effect: RingEffect | CircleEffect, suffix: string) => {
  const fallback = `${Math.round(effect.position.x)}-${Math.round(effect.position.y)}`
  return `veigar-${suffix}-${effect.instanceId || fallback}`
}

const toPolar = (distance: number, angle: number) => ({
  x: Math.cos(angle) * distance,
  y: Math.sin(angle) * distance
})

const VeigarW = (props: { effect: RingEffect }) => {
  const { effect } = props
  const { position, thickness, radius } = effect
  const auraGradientId = effectId(effect, 'w-aura')
  const ringGradientId = effectId(effect, 'w-ring')
  const ringCoreGradientId = effectId(effect, 'w-ring-core')
  const spikeGradientId = effectId(effect, 'w-spike')
  const spikeSheenId = effectId(effect, 'w-spike-sheen')

  const spikeCount = 6
  const outerRadius = radius + thickness * 0.44
  const spikeHeight = Math.max(16, thickness * 1.72)
  const spikeWidth = Math.max(13, thickness * 1.34)

  return <g
    className="veigar-w"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <defs>
      <radialGradient id={auraGradientId} cx="50%" cy="50%" r="56%">
        <stop offset="0%" stopColor="#d777ff" stopOpacity={0.05} />
        <stop offset="58%" stopColor="#a34eff" stopOpacity={0.22} />
        <stop offset="100%" stopColor="#6f2aca" stopOpacity={0.68} />
      </radialGradient>
      <linearGradient id={ringGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e99fff" stopOpacity={0.88} />
        <stop offset="52%" stopColor="#b56eff" stopOpacity={0.78} />
        <stop offset="100%" stopColor="#8f44eb" stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id={ringCoreGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(248, 213, 255, 0.85)" />
        <stop offset="50%" stopColor="rgba(255, 236, 255, 0.95)" />
        <stop offset="100%" stopColor="rgba(248, 213, 255, 0.85)" />
      </linearGradient>
      <linearGradient id={spikeGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#173ca6" stopOpacity={0.95} />
        <stop offset="45%" stopColor="#0b2374" stopOpacity={0.97} />
        <stop offset="100%" stopColor="#02051f" stopOpacity={0.99} />
      </linearGradient>
      <linearGradient id={spikeSheenId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(150, 178, 240, 0.02)" />
        <stop offset="50%" stopColor="rgba(196, 218, 255, 0.28)" />
        <stop offset="100%" stopColor="rgba(150, 178, 240, 0.02)" />
      </linearGradient>
    </defs>

    <circle
      className="veigar-w-aura"
      cx={0}
      cy={0}
      r={outerRadius}
      fill="none"
      stroke={`url(#${auraGradientId})`}
      strokeWidth={Math.max(6, thickness * 0.58)}
    />
    <circle
      className="veigar-w-main-ring"
      cx={0}
      cy={0}
      r={outerRadius}
      fill="none"
      stroke={`url(#${ringGradientId})`}
      strokeWidth={Math.max(2.1, thickness * 0.2)}
    />
    <circle
      className="veigar-w-core-ring"
      cx={0}
      cy={0}
      r={outerRadius * 0.97}
      fill="none"
      stroke={`url(#${ringCoreGradientId})`}
      strokeWidth={Math.max(1.15, thickness * 0.11)}
    />

    <g className="veigar-w-spikes">
      {Array.from({ length: spikeCount }).map((_, index) => {
        const angle = (-Math.PI / 2) + (2 * Math.PI * index / spikeCount)
        const point = toPolar(outerRadius + thickness * 0.2, angle)
        const rotate = angle * 180 / Math.PI + 90
        const spikeShape = `M 0,${-spikeHeight}
          Q ${spikeWidth * 0.72},${-spikeHeight * 0.62} ${spikeWidth * 1.03},${spikeHeight * 0.16}
          Q ${spikeWidth * 0.9},${spikeHeight * 0.48} ${spikeWidth * 0.35},${spikeHeight * 0.58}
          Q 0,${spikeHeight * 0.64} ${-spikeWidth * 0.35},${spikeHeight * 0.58}
          Q ${-spikeWidth * 0.9},${spikeHeight * 0.48} ${-spikeWidth * 1.03},${spikeHeight * 0.16}
          Q ${-spikeWidth * 0.72},${-spikeHeight * 0.62} 0,${-spikeHeight} Z`
        const spikeSheen = `M 0,${-spikeHeight * 0.8}
          Q ${spikeWidth * 0.2},${-spikeHeight * 0.54} ${spikeWidth * 0.32},${spikeHeight * 0.2}
          Q 0,${spikeHeight * 0.36} ${-spikeWidth * 0.32},${spikeHeight * 0.2}
          Q ${-spikeWidth * 0.2},${-spikeHeight * 0.54} 0,${-spikeHeight * 0.8} Z`
        return (
          <g
            key={`spike-${index}`}
            className="veigar-w-spike"
            transform={`translate(${point.x}, ${point.y}) rotate(${rotate}) scale(1 0.66)`}
          >
            <ellipse
              className="veigar-w-spike-glow"
              cx={0}
              cy={spikeHeight * 0.56}
              rx={spikeWidth * 1.02}
              ry={spikeHeight * 0.18}
            />
            <path
              className="veigar-w-spike-body"
              d={spikeShape}
              fill={`url(#${spikeGradientId})`}
              stroke="rgba(103, 151, 229, 0.52)"
              strokeWidth={0.72}
            />
            <path
              className="veigar-w-spike-sheen"
              d={spikeSheen}
              fill={`url(#${spikeSheenId})`}
              opacity={0.32}
            />
            <circle cx={0} cy={spikeHeight * 0.05} r={Math.max(0.95, thickness * 0.06)} fill="rgba(220, 234, 255, 0.64)" />
            <circle cx={0} cy={spikeHeight * 0.28} r={Math.max(0.7, thickness * 0.048)} fill="rgba(176, 198, 236, 0.48)" />
          </g>
        )
      })}
    </g>
  </g >
}

const VeigarQ = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius, direction } = effect
  const shellGradientId = effectId(effect, 'q-shell')
  const coreGradientId = effectId(effect, 'q-core')
  const ringGradientId = effectId(effect, 'q-ring')
  const trailGradientId = effectId(effect, 'q-trail')
  const flareGradientId = effectId(effect, 'q-flare')

  const dx = direction?.x || 1
  const dy = direction?.y || 0
  const magnitude = Math.hypot(dx, dy) || 1
  const nx = dx / magnitude
  const ny = dy / magnitude
  const rotate = Math.atan2(ny, nx) * 180 / Math.PI
  const trailStep = radius * 0.95

  return <g
    className="veigar-q"
    transform={`translate(${position.x}, ${position.y}) rotate(${rotate})`}
  >
    <defs>
      <radialGradient id={shellGradientId} cx="50%" cy="50%" r="56%">
        <stop offset="0%" stopColor="#a48bff" stopOpacity={0.9} />
        <stop offset="52%" stopColor="#6e4be0" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#2f0f74" stopOpacity={0.92} />
      </radialGradient>
      <radialGradient id={coreGradientId} cx="46%" cy="45%" r="58%">
        <stop offset="0%" stopColor="#f8fdff" stopOpacity={1} />
        <stop offset="45%" stopColor="#b5dbff" stopOpacity={0.82} />
        <stop offset="100%" stopColor="#7f73ff" stopOpacity={0.18} />
      </radialGradient>
      <linearGradient id={ringGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f4bbff" stopOpacity={0.85} />
        <stop offset="100%" stopColor="#9c88ff" stopOpacity={0.58} />
      </linearGradient>
      <radialGradient id={trailGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c6dcff" stopOpacity={0.75} />
        <stop offset="100%" stopColor="#9268ff" stopOpacity={0} />
      </radialGradient>
      <radialGradient id={flareGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f6fdff" stopOpacity={0.95} />
        <stop offset="100%" stopColor="#b497ff" stopOpacity={0} />
      </radialGradient>
    </defs>

    {[1, 2, 3].map((index) => (
      <circle
        key={`trail-${index}`}
        className="veigar-q-trail"
        cx={-nx * trailStep * index}
        cy={-ny * trailStep * index}
        r={radius * (0.62 - index * 0.12)}
        fill={`url(#${trailGradientId})`}
        opacity={0.45 - index * 0.1}
      />
    ))}

    <circle className="veigar-q-shell" cx={0} cy={0} r={radius} fill={`url(#${shellGradientId})`} />
    <circle className="veigar-q-aura" cx={0} cy={0} r={radius * 1.15} fill={`url(#${trailGradientId})`} />
    <circle cx={0} cy={0} r={radius * 0.84} fill="none" stroke={`url(#${ringGradientId})`} strokeWidth={Math.max(1.2, radius * 0.11)} />
    <circle className="veigar-q-core" cx={0} cy={0} r={radius * 0.38} fill={`url(#${coreGradientId})`} />

    <path
      className="veigar-q-orbit"
      d={`M ${-radius * 0.66} 0 C ${-radius * 0.12} ${-radius * 0.78} ${radius * 0.4} ${-radius * 0.4} ${radius * 0.74} 0`}
      fill="none"
      stroke="rgba(214, 195, 255, 0.62)"
      strokeWidth={Math.max(0.8, radius * 0.1)}
      strokeDasharray={`${Math.max(3, radius * 0.35)} ${Math.max(4, radius * 0.32)}`}
    >
      <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.35s" repeatCount="indefinite" />
    </path>

    <path
      className="veigar-q-flare"
      d={`M 0 ${-radius * 0.8} L ${radius * 0.23} ${-radius * 0.23} L ${radius * 0.8} 0 L ${radius * 0.23} ${radius * 0.23} L 0 ${radius * 0.8} L ${-radius * 0.23} ${radius * 0.23} L ${-radius * 0.8} 0 L ${-radius * 0.23} ${-radius * 0.23} Z`}
      fill={`url(#${flareGradientId})`}
    />
  </g >
}

export { VeigarW, VeigarQ };
