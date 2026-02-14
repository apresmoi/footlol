import React from 'react';
import { CircleEffect } from '../../../../store/types';
import './styles.scss'

const LeeSinW = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius } = effect
  return <g
    className="leesin-w"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <defs>
      <radialGradient id="leesinw" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f0fcff" stopOpacity={0.72} />
        <stop offset="100%" stopColor="#72c3de" stopOpacity={0.12} />
      </radialGradient>
    </defs>
    <circle cx={0} cy={0} r={radius} fill="url(#leesinw)" />
    <circle cx={0} cy={0} r={radius * 0.65} fill="transparent" stroke="#83d0eb" strokeWidth={2} strokeOpacity={0.8} />
  </g>
}

const LeeSinQ = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius } = effect

  return <g
    className="leesin-q"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <circle cx={0} cy={0} r={radius} fill='#e7f3f4' strokeWidth={1.5} stroke="#62d4f9" />
    <circle cx={0} cy={0} r={radius * 0.6} opacity={0.6} fill='#62d4f9' />
  </g >
}

export { LeeSinQ, LeeSinW };
