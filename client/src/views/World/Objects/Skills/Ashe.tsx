import React from 'react';
import { PolygonEffect, CircleEffect } from '../../../../store/types';
import './styles.scss'

const AsheW = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, direction } = effect

  const rotate = (() => {
    if (direction.x === 0)
      return direction.y > 0 ? 90 : -90
    return (Math.sign(direction.x) === -1 ? -180 : 0) + Math.atan(direction.y / direction.x) * 180 / Math.PI
    // if (direction.x < 0) angle -= 180
    // if (direction.y > 0) angle -= 90
    // if (direction.y < 0) angle += 90
    // return angle
  })()

  return <g
    className="veigar-w"
    transform={`translate(${position.x}, ${position.y}) rotate(${rotate})`}
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#aef0ff" stopOpacity={0.1} />
        <stop offset="100%" stopColor="#aef0ff" stopOpacity={1} />
      </linearGradient>
    </defs>
    <path d="m -100 0 l 25 0 l 5 4 l 30 0 l 10 -10 l 10 10 l 10 -12 l 15 14 l -15 14 l -10 -12 l -10 10 l -10 -10 l -30 0 l -5 4 l -25 0 z"
      fill="url(#grad1)"
    />
  </g >
}

const AsheQ = (props: { effect: PolygonEffect }) => {
  const { effect } = props
  const { position, points } = effect

  return <g
    className="veigar-q"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#aef0ff" stopOpacity={0.1} />
        <stop offset="100%" stopColor="#aef0ff" stopOpacity={1} />
      </linearGradient>
    </defs>
    {points.map((point, i) => <g key={i}>
      <line
        x1={0}
        x2={point[0] - position.x}
        y1={0}
        y2={point[1] - position.y}
        strokeWidth={3}
        stroke="url(#grad1)"
      />
      <line
        x1={0}
        x2={point[0] - position.x}
        y1={0}
        y2={point[1] - position.y}
        strokeWidth={1.5}
        stroke="url(#grad1)"
      />

      <line
        x1={point[0] - position.x - 5}
        x2={point[0] - position.x}
        y1={point[1] - position.y - 5}
        y2={point[1] - position.y}
        strokeWidth={4}
        stroke="url(#grad1)"
      />
    </g>)}
  </g >
}

export { AsheQ, AsheW };
