

import React from 'react';
import { RingEffect, CircleEffect, Player } from '../../../../store/types';
import './styles.scss'

const ShacoW = (props: { effect: CircleEffect, shacoInTeam: boolean }) => {
  const { effect, shacoInTeam } = props
  const { position, radius } = effect
  return <g
    className={`shaco-w ${effect.visible ? "visible" : ""} ${shacoInTeam ? "self" : ""}`}
    transform={`translate(${position.x}, ${position.y})`}
  >
    <circle r={radius} fill='transparent' stroke="white" strokeWidth={1} />
    <rect x={-10} y={-10} width={10} height={10} fill='#b3171d' />
    <rect x={0} y={-10} width={10} height={10} fill='#41383a' />
    <rect x={0} y={0} width={10} height={10} fill='#b3171d' />
    <rect x={-10} y={0} width={10} height={10} fill='#41383a' />
    <circle r={7} fill={'#f8f8f8'} />
  </g>
}

export { ShacoW };
