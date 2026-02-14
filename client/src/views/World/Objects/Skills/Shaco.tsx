import React from 'react';
import { CircleEffect } from '../../../../store/types';
import './styles.scss'

const effectId = (effect: CircleEffect, suffix: string) => {
  const fallback = `${Math.round(effect.position.x)}-${Math.round(effect.position.y)}-${Math.round(effect.radius)}`
  return `shaco-${suffix}-${effect.instanceId || fallback}`
}

const ShacoW = (props: { effect: CircleEffect, shacoInTeam: boolean }) => {
  const { effect, shacoInTeam } = props
  const { position, radius } = effect

  const ringGradientId = effectId(effect, 'ring')
  const zoneGradientId = effectId(effect, 'zone')
  const bodyGradientId = effectId(effect, 'body')
  const panelGradientId = effectId(effect, 'panel')
  const lidGradientId = effectId(effect, 'lid')
  const metalGradientId = effectId(effect, 'metal')
  const faceGradientId = effectId(effect, 'face')
  const hatGradientId = effectId(effect, 'hat')

  const trapSize = Math.max(20, Math.min(40, radius * 0.38))
  const boxWidth = trapSize * 1.35
  const boxHeight = trapSize * 0.95
  const lidHeight = trapSize * 0.32
  const left = -boxWidth / 2
  const top = -boxHeight / 2

  const springTopY = top - trapSize * 0.82
  const springBottomY = top - lidHeight * 0.08
  const headY = springTopY - trapSize * 0.18

  return <g
    className={`shaco-w ${effect.visible ? "visible armed" : ""} ${shacoInTeam ? "self" : ""}`}
    transform={`translate(${position.x}, ${position.y})`}
  >
    <defs>
      <linearGradient id={ringGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c24f62" stopOpacity={0.72} />
        <stop offset="55%" stopColor="#d5b66a" stopOpacity={0.62} />
        <stop offset="100%" stopColor="#5e2746" stopOpacity={0.74} />
      </linearGradient>
      <radialGradient id={zoneGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#7a2f4a" stopOpacity={0.22} />
        <stop offset="62%" stopColor="#4d1d32" stopOpacity={0.1} />
        <stop offset="100%" stopColor="#2b0f1e" stopOpacity={0.02} />
      </radialGradient>

      <linearGradient id={bodyGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#632940" />
        <stop offset="48%" stopColor="#4a1e31" />
        <stop offset="100%" stopColor="#2f1222" />
      </linearGradient>
      <linearGradient id={panelGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#dbb878" />
        <stop offset="100%" stopColor="#9c7845" />
      </linearGradient>
      <linearGradient id={lidGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#cb5162" />
        <stop offset="50%" stopColor="#973448" />
        <stop offset="100%" stopColor="#66263d" />
      </linearGradient>
      <linearGradient id={metalGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f1d9a4" />
        <stop offset="100%" stopColor="#b78f58" />
      </linearGradient>
      <radialGradient id={faceGradientId} cx="50%" cy="45%" r="52%">
        <stop offset="0%" stopColor="#f6e4be" />
        <stop offset="100%" stopColor="#d2a26a" />
      </radialGradient>
      <linearGradient id={hatGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#7e2f58" />
        <stop offset="50%" stopColor="#b74f70" />
        <stop offset="100%" stopColor="#622744" />
      </linearGradient>
    </defs>

    <circle className="jack-zone-ring" r={radius} fill={`url(#${zoneGradientId})`} stroke={`url(#${ringGradientId})`} strokeWidth={1.35} strokeDasharray="10 8" />
    <circle className="jack-zone-ring-inner" r={radius * 0.64} fill="none" stroke="rgba(218, 172, 99, 0.22)" strokeWidth={0.9} strokeDasharray="4 6" />

    <g className="jack-box">
      <rect x={left} y={top} width={boxWidth} height={boxHeight} rx={4.5} fill={`url(#${bodyGradientId})`} stroke="rgba(238, 199, 127, 0.34)" strokeWidth={1} />

      <rect x={left + boxWidth * 0.12} y={top + boxHeight * 0.14} width={boxWidth * 0.22} height={boxHeight * 0.72} rx={2} fill={`url(#${panelGradientId})`} opacity={0.88} />
      <rect x={left + boxWidth * 0.66} y={top + boxHeight * 0.14} width={boxWidth * 0.22} height={boxHeight * 0.72} rx={2} fill={`url(#${panelGradientId})`} opacity={0.88} />

      <line x1={left + boxWidth * 0.5} y1={top + boxHeight * 0.08} x2={left + boxWidth * 0.5} y2={top + boxHeight * 0.92} stroke="rgba(246, 219, 165, 0.28)" strokeWidth={1} />

      <g className="jack-crank" transform={`translate(${left + boxWidth + 2}, ${top + boxHeight * 0.44})`}>
        <line x1={0} y1={0} x2={7} y2={0} stroke={`url(#${metalGradientId})`} strokeWidth={1.7} strokeLinecap="round" />
        <circle cx={7} cy={0} r={1.8} fill={`url(#${metalGradientId})`} />
        <line x1={7} y1={0} x2={11} y2={4} stroke={`url(#${metalGradientId})`} strokeWidth={1.7} strokeLinecap="round" />
        <circle cx={12.6} cy={5.2} r={2.4} fill="#d2ad6f" stroke="rgba(88, 52, 31, 0.55)" strokeWidth={0.8} />
      </g>

      <g className="jack-lid" transform={`translate(0, ${top + 1})`}>
        <rect x={left - 1.2} y={-lidHeight} width={boxWidth + 2.4} height={lidHeight} rx={3.2} fill={`url(#${lidGradientId})`} stroke="rgba(247, 210, 133, 0.4)" strokeWidth={1} />
        <rect x={-boxWidth * 0.12} y={-lidHeight * 0.65} width={boxWidth * 0.24} height={lidHeight * 0.35} rx={1.8} fill={`url(#${metalGradientId})`} stroke="rgba(96, 58, 38, 0.42)" strokeWidth={0.7} />
      </g>

      <g className="jack-pop">
        <path
          className="jack-spring"
          d={`M0 ${springBottomY} C ${-trapSize * 0.18} ${springBottomY - trapSize * 0.12}, ${trapSize * 0.18} ${springBottomY - trapSize * 0.26}, 0 ${springBottomY - trapSize * 0.4}
             C ${-trapSize * 0.18} ${springBottomY - trapSize * 0.54}, ${trapSize * 0.18} ${springBottomY - trapSize * 0.68}, 0 ${springTopY}`}
          fill="none"
          stroke="rgba(224, 191, 119, 0.92)"
          strokeWidth={1.55}
          strokeLinecap="round"
        />

        <g className="jack-head" transform={`translate(0, ${headY})`}>
          <circle cx={0} cy={0} r={trapSize * 0.22} fill={`url(#${faceGradientId})`} stroke="rgba(111, 64, 44, 0.52)" strokeWidth={0.85} />
          <circle cx={-trapSize * 0.08} cy={-trapSize * 0.04} r={trapSize * 0.03} fill="#2f1823" />
          <circle cx={trapSize * 0.08} cy={-trapSize * 0.04} r={trapSize * 0.03} fill="#2f1823" />
          <path d={`M${-trapSize * 0.08} ${trapSize * 0.08} Q 0 ${trapSize * 0.16} ${trapSize * 0.08} ${trapSize * 0.08}`} fill="none" stroke="#61273d" strokeWidth={1} strokeLinecap="round" />

          <path d={`M${-trapSize * 0.23} ${-trapSize * 0.12} L${-trapSize * 0.04} ${-trapSize * 0.34} L${-trapSize * 0.02} ${-trapSize * 0.08} Z`} fill={`url(#${hatGradientId})`} />
          <path d={`M${trapSize * 0.23} ${-trapSize * 0.12} L${trapSize * 0.04} ${-trapSize * 0.34} L${trapSize * 0.02} ${-trapSize * 0.08} Z`} fill={`url(#${hatGradientId})`} />
          <circle cx={-trapSize * 0.05} cy={-trapSize * 0.34} r={trapSize * 0.032} fill="#efc874" />
          <circle cx={trapSize * 0.05} cy={-trapSize * 0.34} r={trapSize * 0.032} fill="#efc874" />
        </g>
      </g>
    </g>
  </g>
}

export { ShacoW };
