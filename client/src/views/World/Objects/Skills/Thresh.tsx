import React from 'react';
import { PolygonEffect, CircleEffect, RectEffect, VectorEffect } from '../../../../store/types';
import './styles.scss'

const ThreshW = (props: { effect: VectorEffect }) => {
  const { effect } = props
  const { position, to, radius } = effect

  return <g
    className="veigar-q"
    transform={`translate(${to.x}, ${to.y})`}
  >
    <line x2={position.x - to.x} y2={position.y - to.y} stroke={'#55d7c1'} strokeWidth={2} />
    <line x2={position.x - to.x} y2={position.y - to.y} stroke={'#43a49c'} strokeWidth={4} />
    <g
      transform={"rotate(45)"}
    >
      <rect
        x={-radius / 4} y={-radius / 4} width={radius / 2} height={radius / 2} fill="transparent" stroke={'#55d7c1'} strokeWidth={2} />
      <rect
        x={-radius / 2} y={-radius / 2} width={radius} height={radius} fill="transparent" stroke={'#55d7c1'} strokeWidth={2} />
      <circle r={radius / 8} fill="#937b7b" />
    </g>
  </g>
}

const ThreshQ = (props: { effect: VectorEffect }) => {
  const { effect } = props
  const { position, to, radius } = effect

  return <g
    className="veigar-q"
    transform={`translate(${to.x}, ${to.y})`}
  >
    <line x2={position.x - to.x} y2={position.y - to.y} stroke={'#43a49c'} strokeWidth={4} />
    <line x2={position.x - to.x} y2={position.y - to.y} stroke={'#55d7c1'} strokeWidth={2} />
    <circle r={radius} fill={'#55d7c1'} />
  </g>
}

export { ThreshQ, ThreshW };
