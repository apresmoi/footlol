import React from 'react';
import { CircleEffect, RectEffect } from '../../../../store/types';
import './styles.scss'

const AmumuW = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius } = effect
  return <g
    className="amumu-w"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <defs>
      <radialGradient id="amumuw" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#eaa52e" />
        <stop offset="20%" stopColor="#7f8522" />
        <stop offset="40%" stopColor="#7a722f" />
        <stop offset="60%" stopColor="#988626" />
        <stop offset="80%" stopColor="#88752a" />
        <stop offset="100%" stopColor="#575928" />
      </radialGradient>
    </defs>
    <circle cx={0} cy={0} r={radius} fill='url(#amumuw)' fillOpacity={0.4} stroke="#1c0438" />
  </g>
}

const AmumuQ = (props: { effect: RectEffect }) => {
  const { effect } = props
  const { position, width, height, angle } = effect

  return <g
    className="amumu-q"
    transform={`translate(${position.x}, ${position.y}) rotate(${angle * 180 / Math.PI})`}
  >
    <defs>
      <linearGradient id="amumuq" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#779677" stopOpacity={0.5} />
        <stop offset="25%" stopColor="#4d6854" stopOpacity={0.7} />
        <stop offset="50%" stopColor="#779677" stopOpacity={0.8} />
        <stop offset="75%" stopColor="#4d6854" stopOpacity={0.7} />
        <stop offset="100%" stopColor="#779677" stopOpacity={0.5} />
      </linearGradient>
    </defs>
    <rect x={0} y={-height / 2} width={width} height={height} fill={`url(#amumuq)`} stroke="#92ae92" strokeWidth={0.8} />
  </g >
}

export { AmumuQ, AmumuW };
