import React from 'react';
import { RingEffect, CircleEffect } from '../../../../store/types';
import './styles.scss'

const VeigarW = (props: { effect: RingEffect }) => {
  const { effect } = props
  const { position, thickness, radius } = effect
  console.log(thickness, radius)
  return <g
    className="veigar-w"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <circle cx={0} cy={0} r={radius + thickness / 2} strokeWidth={thickness} fill='transparent' stroke="#1c0438" />
    <g className="veigar-w-spikes">
      {new Array(5).fill(0).map((x, i, ar) => <g key={i}
        transform={`
    translate(
      ${(radius + thickness / 2) * Math.cos(2 * i * Math.PI / ar.length + Math.PI / 2)},
      ${(radius + thickness / 2) * Math.sin(2 * i * Math.PI / ar.length + Math.PI / 2)}
    ) 
    rotate(${360 * i / ar.length})`}
      >
        <polygon
          points={`${thickness / 8},${-thickness} ${thickness / 4},${thickness} ${-thickness / 4},${thickness} ${-thickness / 8},${-thickness}`}
          strokeWidth={thickness / 2} fill='transparent' stroke="#1c0438" />

        <polygon
          points={`${thickness / 8},${-thickness} ${thickness / 4},${thickness} ${-thickness / 4},${thickness} ${-thickness / 8},${-thickness}`}
          strokeWidth={thickness / 4} fill='transparent' stroke="#572c7f" />
      </g>
      )}</g>
  </g >
}

const VeigarQ = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius } = effect
  return <g
    className="veigar-q"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <circle cx={0} cy={0} r={radius} fill='#1c0438' strokeWidth={1.5} stroke="#572c7f" />
    <circle cx={0} cy={0} r={radius * 0.3} fill='#d757c4' />
  </g >
}

export { VeigarW, VeigarQ };
