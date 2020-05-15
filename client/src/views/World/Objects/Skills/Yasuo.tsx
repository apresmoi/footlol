import React from 'react';
import { PolygonEffect, CircleEffect, RectEffect } from '../../../../store/types';
import './styles.scss'

const YasuoQ = (props: { effect: PolygonEffect }) => {
  return null
}

const YasuoW = (props: { effect: PolygonEffect }) => {
  const { effect } = props
  const { position, points, angle, direction } = effect

  return <g
    className="veigar-w"
  >
    <defs>
      <linearGradient id="yasuow1" x1="0%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#7d9dae" stopOpacity={1} />
        <stop offset="25%" stopColor="#576174" stopOpacity={1} />
        <stop offset="50%%" stopColor="#7d9dae" stopOpacity={1} />
        <stop offset="75%" stopColor="#576174" stopOpacity={1} />
        <stop offset="100%" stopColor="#7d9dae" stopOpacity={1} />
      </linearGradient>
    </defs>
    <polygon stroke={`url(#yasuow1)`} strokeWidth="5" x={0} y={0} points={points.map(point => point[0] + "," + point[1]).join(' ')} />
  </g >
}


export { YasuoW, YasuoQ };
