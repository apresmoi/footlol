import React from 'react';
import { CircleEffect } from '../../../../store/types';
import './styles.scss'

//https://jxnblk.github.io/paths/?d=M22%2016%20L24%2022%20L28%2028%20L32%2032%20L36%2028%20L40%2022%20L42%2016%20L40%2012%20L36%2012%20L32%2018%20L28%2012%20L24%2012%20Z

const AhriQ = (props: { effect: CircleEffect }) => {
  const { effect } = props
  const { position, direction } = effect
  const rotate = Math.atan2(direction.y, direction.x) * 180 / Math.PI

  return <g
    className="ahri-q"
    transform={`translate(${position.x}, ${position.y}) rotate(${-rotate})`}
  >
    <defs>
      <radialGradient id="ahri-q" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#e993e9" />
        <stop offset="50%" stopColor="#ffe0ff" />
        <stop offset="100%" stopColor="#e993e9" />
      </radialGradient>
    </defs>
    <g transform={`translate(${-32}, ${-22})`}>
      <path d="M22 16 L24 22 L28 28 L32 32 L36 28 L40 22 L42 16 L40 12 L36 12 L32 18 L28 12 L24 12 Z" fill="url(#ahri-q)" />
    </g>
  </g >
}

export { AhriQ };
