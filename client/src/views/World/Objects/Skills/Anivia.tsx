import React from 'react';
import { PolygonEffect, CircleEffect, RectEffect } from '../../../../store/types';
import './styles.scss'

const AniviaW = (props: { effect: RectEffect }) => {
  const { effect } = props
  const { position, width, height, angle } = effect


  return <g
    className="anivia-w"
    transform={`translate(${position.x}, ${position.y}) rotate(${angle * 180 / Math.PI})`}
  >
    <defs>
      <linearGradient id="aniviaw" x1="0%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#6caef2" stopOpacity={1} />
        <stop offset="25%" stopColor="#2f5299" stopOpacity={1} />
        <stop offset="50%%" stopColor="#6caef2" stopOpacity={1} />
        <stop offset="75%" stopColor="#2f5299" stopOpacity={1} />
        <stop offset="100%" stopColor="#6caef2" stopOpacity={1} />
      </linearGradient>
      <linearGradient id="aniviaw2" x1="0%" y1="0%" x2="25%" y2="100%">
        <stop offset="0%" stopColor="#6caef2" stopOpacity={1} />
        <stop offset="25%" stopColor="#2f5299" stopOpacity={1} />
        <stop offset="50%%" stopColor="#6caef2" stopOpacity={1} />
        <stop offset="75%" stopColor="#2f5299" stopOpacity={1} />
        <stop offset="100%" stopColor="#6caef2" stopOpacity={1} />
      </linearGradient>
    </defs>
    <rect x={-width / 2} y={-height / 2} width={width} height={height} fill="url(#aniviaw)" />
    <rect x={-width / 2} y={-height / 2} width={width} height={height} fill="url(#aniviaw2)" opacity={0.5} />
  </g >
}

const AniviaQ = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, radius } = effect

  return <g
    className="anivia-q"
    transform={`translate(${position.x}, ${position.y})`}
  >
    <circle r={radius} fill="#2167ea" opacity={0.3} />
    <circle r={radius * 3 / 4} fill="#35cbff" opacity={0.7} />
    {new Array(3).fill(0).map((x, i) => {
      return <line x={Math.random() * -radius} x1={Math.random() * radius} y1={Math.random() * -radius} y2={Math.random() * radius} stroke="#22affd" strokeWidth={2} />
    })}
  </g >
}

export { AniviaQ, AniviaW };
