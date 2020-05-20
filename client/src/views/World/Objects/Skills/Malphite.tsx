import React from 'react';
import { PolygonEffect, CircleEffect } from '../../../../store/types';
import './styles.scss'

const MalphiteW = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius } = effect
  return <g
    className="malphite-w"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <defs>
      <radialGradient id="malphite-w" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#322728" stopOpacity={0.8} />
        <stop offset="20%" stopColor="#333121" stopOpacity={0.8} />
        <stop offset="40%" stopColor="#36271d" stopOpacity={0.8} />
        <stop offset="60%" stopColor="#322728" stopOpacity={0.8} />
        <stop offset="80%" stopColor="#2e2524" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#211915" stopOpacity={0.6} />
      </radialGradient>
    </defs>
    <circle cx={0} cy={0} r={radius} fill='url(#malphite-w)' />
  </g>
}

const MalphiteQ = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius } = effect
  return <g
    className="malphite-q"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <defs>
      <radialGradient id="malphite-q" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#9d7d4f" stopOpacity={0.8} />
        <stop offset="20%" stopColor="#94723d" stopOpacity={0.8} />
        <stop offset="40%" stopColor="#5e3d1d" stopOpacity={0.8} />
        <stop offset="60%" stopColor="#6d4d2d" stopOpacity={0.8} />
        <stop offset="80%" stopColor="#91683e" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#4f3e25" stopOpacity={0.8} />
      </radialGradient>
    </defs>
    <circle cx={0} cy={0} r={radius / 2} fill='url(#malphite-q)' stroke="#a2783f" />
    <circle cx={0} cy={0} r={radius} fill='#b07946' stroke="" />
  </g>
}

export { MalphiteQ, MalphiteW };
