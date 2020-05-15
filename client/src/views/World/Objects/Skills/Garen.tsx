import React from 'react';
import { PolygonEffect, CircleEffect, RectEffect } from '../../../../store/types';
import './styles.scss'

const GarenW = (props: { effect: RectEffect }) => {
  const { effect } = props
  const { position, width, height, angle } = effect

  return <g
    className="veigar-q"
    transform={`translate(${position.x}, ${position.y}) rotate(${angle * 180 / Math.PI})`}
  >
    <path opacity={0.8} transform="scale(3,3)" d="m 0 15 q -15 0 -19 -15 q 1 -18 18 -20 q 16 -2 23 20 q -3 27 -31 24 l 0 -2 q 23 1 28 -21 q -5 -14 -19 -18 q -12 1 -14 17 q 1 7 10 11 z "
      fill="#cfa639" />
    <path opacity={0.7} transform="scale(2.7,2.7)" d="m 0 15 q -15 0 -19 -15 q 1 -18 18 -20 q 16 -2 23 20 q -3 27 -31 24 l 0 -2 q 23 1 28 -21 q -5 -14 -19 -18 q -12 1 -14 17 q 1 7 10 11 z "
      fill="#d0af43" />
    <rect x={0} y={0} width={width} height={height / 2} fill="#869197" />
    <rect x={0} y={0} width={width * 3 / 4} height={height / 2} fill="#2a2734" />
  </g >
}

export { GarenW };
