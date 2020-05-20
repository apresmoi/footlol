import React from 'react';
import { PolygonEffect, CircleEffect } from '../../../../store/types';
import './styles.scss'

const AsheW = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, direction, radius } = effect

  const rotate = (() => {
    if (direction.x === 0)
      return direction.y > 0 ? 90 : -90
    return (Math.sign(direction.x) === -1 ? -180 : 0) + Math.atan(direction.y / direction.x) * 180 / Math.PI
  })()

  return <g
    className="ashe-w"
    transform={`translate(${position.x}, ${position.y}) rotate(${rotate})`}
  >
    <defs>
      <linearGradient id="ashe-w" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#aef0ff" stopOpacity={0.1} />
        <stop offset="100%" stopColor="#aef0ff" stopOpacity={1} />
      </linearGradient>
    </defs>
    <path d="m -85 -6 l 25 0 l 5 4 l 30 0 l 10 -10 l 10 10 l 10 -12 l 15 14 l -15 14 l -10 -12 l -10 10 l -10 -10 l -30 0 l -5 4 l -25 0 z" fill="url(#ashe-w)" />
  </g >
}

const AsheQ = (props: { effect: PolygonEffect }) => {
  const { effect } = props
  const { position, points } = effect


  const rotate = (vector) => {
    if (vector.x === 0)
      return vector.y > 0 ? 90 : -90
    return (Math.sign(vector.x) === -1 ? -180 : 0) + Math.atan(vector.y / vector.x) * 180 / Math.PI
  }

  return <g
    className="ashe-q"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <defs>
      <linearGradient id="ashe-q" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#aef0ff" stopOpacity={0.1} />
        <stop offset="100%" stopColor="#aef0ff" stopOpacity={1} />
      </linearGradient>
    </defs>
    {points.map((point, i) => <g key={i}
      transform={`translate(${point[0] - position.x}, ${point[1] - position.y}) rotate(${rotate({ x: point[0] - position.x, y: point[1] - position.y })})`}
    >
      <path
        transform={`scale(0.75, 0.25)`}
        d="m -100 0 l 25 0 l 5 4 l 30 0 l 10 -10 l 10 10 l 10 -12 l 15 14 l -15 14 l -10 -12 l -10 10 l -10 -10 l -30 0 l -5 4 l -25 0 z" fill="url(#ashe-q)" />
    </g>)}
  </g >
}

export { AsheQ, AsheW };
