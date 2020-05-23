import React from 'react';
import { PolygonEffect, CircleEffect, RectEffect } from '../../../../store/types';
import './styles.scss'

//https://jxnblk.github.io/paths/?d=M0%2024%20L42%2026%20L46%2028%20L48%2032%20L64%2024%20L48%2016%20L46%2020%20L42%2022%20Z

const LucianW = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, direction, radius } = effect

  const rotate = (() => {
    if (direction.x === 0)
      return direction.y > 0 ? 90 : -90
    return (Math.sign(direction.x) === -1 ? -180 : 0) + Math.atan(direction.y / direction.x) * 180 / Math.PI
  })()

  return <g
    className="lucian-w"
    transform={`translate(${position.x}, ${position.y}) rotate(${rotate})`}
  >
    <defs>
      <linearGradient id="lucian-w" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0559ce" stopOpacity={0.1} />
        <stop offset="50%" stopColor="#0559ce" stopOpacity={0.3} />
        <stop offset="70%" stopColor="#9ed4f7" stopOpacity={1} />
        <stop offset="95%" stopColor="#fffeff" stopOpacity={1} />
        <stop offset="100%" stopColor="#dedeaa" stopOpacity={1} />
      </linearGradient>
    </defs>
    <g transform={`translate(${-64}, ${-24})`}>
      <path d="M0 24 L42 26 L46 28 L48 32 L64 24 L48 16 L46 20 L42 22 Z" fill="url(#lucian-w)" />
    </g>
  </g >
}

export { LucianW };
