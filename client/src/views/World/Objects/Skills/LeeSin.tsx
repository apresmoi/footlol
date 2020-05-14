import React from 'react';
import { PolygonEffect, CircleEffect, RectEffect } from '../../../../store/types';
import './styles.scss'

const LeeSinW = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius } = effect
  return null
}

const LeeSinQ = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius } = effect

  console.log(props)

  return <g
    className="veigar-q"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <circle cx={0} cy={0} r={radius} fill='#e7f3f4' strokeWidth={1.5} stroke="#62d4f9" />
    <circle cx={0} cy={0} r={radius * 0.6} opacity={0.6} fill='#62d4f9' />
  </g >
}

export { LeeSinQ, LeeSinW };
