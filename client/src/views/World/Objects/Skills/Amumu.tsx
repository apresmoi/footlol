import React from 'react';
import { CircleEffect, RectEffect } from '../../../../store/types';
import './styles.scss'

const effectId = (effect: CircleEffect | RectEffect, suffix: string) => {
  const fallback = `${Math.round(effect.position.x)}-${Math.round(effect.position.y)}`
  return `amumu-${suffix}-${effect.instanceId || fallback}`
}

const toPolar = (distance: number, angle: number) => ({
  x: Math.cos(angle) * distance,
  y: Math.sin(angle) * distance
})

const pseudo = (index: number): number => {
  const value = Math.sin((index + 1) * 127.1) * 43758.5453
  return value - Math.floor(value)
}

const AmumuW = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius } = effect

  const auraGradientId = effectId(effect, 'w-aura')
  const coreGradientId = effectId(effect, 'w-core')
  const veilGradientId = effectId(effect, 'w-veil')
  const beamGradientId = effectId(effect, 'w-beam')
  const starGradientId = effectId(effect, 'w-star')

  const runeShapes = [
    'M -2.1 2 L -1.1 -2.2 L 1.1 -2.2 L 2.1 2',
    'M -2.3 -1.8 L 2.3 -1.8 L 0 2.2 Z',
    'M -2.1 -2 L -2.1 2 L 2.1 2',
    'M -2.2 -1.7 L 2.2 0 L -2.2 1.7',
    'M -1.2 -2.2 L 1.2 -2.2 L 1.2 2.2 L -1.2 2.2 Z',
    'M -2.3 2 L -0.6 -2.2 L 0.6 1.1 L 2.3 -2.2'
  ]

  const runeCount = Math.max(30, Math.round(radius / 3.2))
  const beamCount = 18
  const starCount = 90
  const runeScale = Math.max(1.08, radius * 0.017)
  const ringRadius = radius * 1.005

  return <g
    className="amumu-w"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <defs>
      <radialGradient id={auraGradientId} cx="50%" cy="50%" r="56%">
        <stop offset="0%" stopColor="#f9e35e" stopOpacity={0.26} />
        <stop offset="52%" stopColor="#9f9330" stopOpacity={0.42} />
        <stop offset="100%" stopColor="#2b3418" stopOpacity={0.76} />
      </radialGradient>
      <radialGradient id={coreGradientId} cx="46%" cy="48%" r="58%">
        <stop offset="0%" stopColor="#f7eb7e" stopOpacity={0.5} />
        <stop offset="60%" stopColor="#8d8b2d" stopOpacity={0.32} />
        <stop offset="100%" stopColor="#344323" stopOpacity={0.06} />
      </radialGradient>
      <radialGradient id={veilGradientId} cx="50%" cy="50%" r="56%">
        <stop offset="0%" stopColor="#f2e065" stopOpacity={0} />
        <stop offset="68%" stopColor="#b9a838" stopOpacity={0.22} />
        <stop offset="100%" stopColor="#f3d652" stopOpacity={0.62} />
      </radialGradient>
      <linearGradient id={beamGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255, 234, 125, 0.88)" />
        <stop offset="100%" stopColor="rgba(170, 151, 55, 0)" />
      </linearGradient>
      <radialGradient id={starGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff5b0" stopOpacity={0.98} />
        <stop offset="52%" stopColor="#f0d05f" stopOpacity={0.62} />
        <stop offset="100%" stopColor="#f0d05f" stopOpacity={0} />
      </radialGradient>
    </defs>

    <circle className="amumu-w-aura" cx={0} cy={0} r={radius} fill={`url(#${auraGradientId})`} />
    <circle className="amumu-w-core" cx={0} cy={0} r={radius * 0.88} fill={`url(#${coreGradientId})`} />

    <g className="amumu-w-beams">
      {Array.from({ length: beamCount }).map((_, index) => {
        const angle = (2 * Math.PI * index / beamCount) + pseudo(index + 3) * 0.16
        const length = radius * (0.5 + pseudo(index + 11) * 0.42)
        const width = radius * (0.06 + pseudo(index + 17) * 0.06)
        const inner = radius * 0.06
        const beamPath = `M 0 ${-inner}
          C ${width} ${-radius * 0.2} ${width * 0.34} ${-length * 0.74} 0 ${-length}
          C ${-width * 0.34} ${-length * 0.74} ${-width} ${-radius * 0.2} 0 ${-inner} Z`
        return (
          <path
            key={`beam-${index}`}
            className="amumu-w-beam"
            d={beamPath}
            fill={`url(#${beamGradientId})`}
            transform={`rotate(${angle * 180 / Math.PI})`}
            style={{ animationDelay: `${index * 0.05}s` }}
          />
        )
      })}
    </g>

    <g className="amumu-w-stars">
      {Array.from({ length: starCount }).map((_, index) => {
        const angle = 2 * Math.PI * pseudo(index + 21)
        const distance = radius * (0.04 + 0.93 * pseudo(index + 33))
        const point = toPolar(distance, angle)
        const starRadius = Math.max(0.45, radius * (0.004 + pseudo(index + 49) * 0.009))
        return (
          <circle
            key={`star-${index}`}
            className="amumu-w-star"
            cx={point.x}
            cy={point.y}
            r={starRadius}
            fill={`url(#${starGradientId})`}
            style={{ animationDelay: `${index * 0.03}s` }}
          />
        )
      })}
    </g>

    <circle className="amumu-w-veil" cx={0} cy={0} r={ringRadius} fill="none" stroke={`url(#${veilGradientId})`} strokeWidth={Math.max(6, radius * 0.09)} />

    <g className="amumu-w-runes">
      {Array.from({ length: runeCount }).map((_, index) => {
        const angle = (-Math.PI / 2) + (2 * Math.PI * index / runeCount)
        const jitter = (pseudo(index + 61) - 0.5) * radius * 0.02
        const point = toPolar(ringRadius + jitter, angle)
        const rotate = angle * 180 / Math.PI + 90 + (pseudo(index + 73) - 0.5) * 8
        const path = runeShapes[index % runeShapes.length]
        return (
          <g
            key={`rune-${index}`}
            className="amumu-w-rune"
            transform={`translate(${point.x}, ${point.y}) rotate(${rotate}) scale(${runeScale})`}
            style={{ animationDelay: `${index * 0.04}s` }}
          >
            <path d={path} fill="none" stroke="rgba(236, 187, 53, 0.46)" strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" />
            <path className="amumu-w-rune-core" d={path} fill="none" stroke="rgba(255, 223, 106, 0.92)" strokeWidth={0.75} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )
      })}
    </g>
  </g>
}

const AmumuQ = (props: { effect: RectEffect }) => {
  const { effect } = props
  const { position, width, height, angle } = effect
  const bandageGradientId = effectId(effect, 'q-bandage')
  const bandageCoreId = effectId(effect, 'q-bandage-core')
  const tipGradientId = effectId(effect, 'q-tip')
  const dustGradientId = effectId(effect, 'q-dust')

  const sway = Math.max(4, height * 0.9)
  const halfBand = Math.max(1.2, height * 0.16)
  const separation = Math.max(2.2, height * 0.28)

  const makeRibbon = (offsetY: number) => {
    const top = `M 0 ${offsetY - halfBand}
      C ${width * 0.24} ${offsetY - halfBand - sway} ${width * 0.48} ${offsetY + halfBand + sway} ${width} ${offsetY - halfBand}`
    const bottom = `C ${width * 0.48} ${offsetY + halfBand + sway * 0.8} ${width * 0.24} ${offsetY - halfBand - sway * 0.8} 0 ${offsetY + halfBand} Z`
    return `${top} ${bottom}`
  }

  const ribbonA = makeRibbon(-separation)
  const ribbonB = makeRibbon(separation)

  const dustCount = Math.max(18, Math.round(width / 14))

  return <g
    className="amumu-q"
    transform={`translate(${position.x}, ${position.y}) rotate(${angle * 180 / Math.PI})`}
  >
    <defs>
      <linearGradient id={bandageGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(152, 224, 210, 0.88)" />
        <stop offset="45%" stopColor="rgba(132, 206, 194, 0.84)" />
        <stop offset="100%" stopColor="rgba(120, 186, 177, 0.28)" />
      </linearGradient>
      <linearGradient id={bandageCoreId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(201, 248, 236, 0.78)" />
        <stop offset="100%" stopColor="rgba(160, 231, 219, 0.08)" />
      </linearGradient>
      <radialGradient id={tipGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f0ffd0" stopOpacity={0.98} />
        <stop offset="55%" stopColor="#dbf3b2" stopOpacity={0.72} />
        <stop offset="100%" stopColor="#dbf3b2" stopOpacity={0} />
      </radialGradient>
      <radialGradient id={dustGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f4e59f" stopOpacity={0.88} />
        <stop offset="100%" stopColor="#f4e59f" stopOpacity={0} />
      </radialGradient>
    </defs>

    <g className="amumu-q-dust">
      {Array.from({ length: dustCount }).map((_, index) => {
        const t = (index + 1) / (dustCount + 1)
        const x = width * t
        const y = (pseudo(index + 201) - 0.5) * height * 3.1
        const r = Math.max(0.45, height * (0.06 + pseudo(index + 217) * 0.1))
        return (
          <circle
            key={`dust-${index}`}
            className="amumu-q-dust-particle"
            cx={x}
            cy={y}
            r={r}
            fill={`url(#${dustGradientId})`}
            style={{ animationDelay: `${index * 0.025}s` }}
          />
        )
      })}
    </g>

    <path className="amumu-q-bandage" d={ribbonA} fill={`url(#${bandageGradientId})`} />
    <path className="amumu-q-bandage" d={ribbonB} fill={`url(#${bandageGradientId})`} />
    <path className="amumu-q-bandage-core" d={ribbonA} fill={`url(#${bandageCoreId})`} />
    <path className="amumu-q-bandage-core" d={ribbonB} fill={`url(#${bandageCoreId})`} />

    <ellipse className="amumu-q-tip-glow" cx={width} cy={0} rx={height * 1.25} ry={height * 0.82} fill={`url(#${tipGradientId})`} />
    <ellipse className="amumu-q-tip-core" cx={width} cy={0} rx={height * 0.62} ry={height * 0.35} fill="rgba(228, 247, 184, 0.88)" />
  </g >
}

export { AmumuQ, AmumuW };
