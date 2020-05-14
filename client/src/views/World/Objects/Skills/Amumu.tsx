import React from 'react';
import { PolygonEffect, CircleEffect, RectEffect } from '../../../../store/types';
import './styles.scss'

const AmumuW = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius } = effect
  return <g
    className="veigar-w"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <defs>
      <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#eaa52e" stopOpacity={0.3} />
        <stop offset="20%" stopColor="#7f8522" stopOpacity={0.3} />
        <stop offset="40%" stopColor="#7a722f" stopOpacity={0.6} />
        <stop offset="60%" stopColor="#988626" stopOpacity={0.3} />
        <stop offset="80%" stopColor="#88752a" stopOpacity={0.3} />
        <stop offset="100%" stopColor="#575928" stopOpacity={0.6} />
      </radialGradient>
    </defs>
    <circle cx={0} cy={0} r={radius} fill='url(#grad1)' stroke="#1c0438" />
  </g>
}

const AmumuQ = (props: { effect: RectEffect }) => {
  const { effect } = props
  const { position, width, height, angle } = effect

  console.log(props)

  return <g
    className="veigar-q"
    transform={`translate(${position.x}, ${position.y}) rotate(${angle * 180 / Math.PI})`}
  >
    <rect x={0} y={-height / 2} width={width} height={height} />
  </g >
}

export { AmumuQ, AmumuW };
