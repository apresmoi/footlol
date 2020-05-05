import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player } from './types'


const PlayerComponent = (props: { player: Player, isSelf?: boolean }) => {
  const { player, isSelf } = props
  return <g
    key={player.id}
    transform={`translate(${player.position.x}, ${player.position.y})`}
  >
    <defs>
      <pattern id={`${player.id}_image`} x="-5%" y="-5%" height="105%" width="105%"
        viewBox="0 0 120 120">
        <image x="0" y="0" width="120" height="120" xlinkHref={`http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${player.champion}.png`}></image>
      </pattern>
    </defs>
    <circle
      cx={0}
      cy={0}
      r={30}
      // fill={`white`}
    />
    <circle
      cx={0}
      cy={0}
      r={25}
      fill={`url(#${player.id}_image)`}
    />
    <text
      transform={`translate(0, -20)`}
      textAnchor="middle"
      fill='white'
    >{player.name} </text>
    <text
      transform={`translate(0, 30)`}
      textAnchor="middle"
      fill='white'
    >{player.position.x},{player.position.y} </text>
  </g >
}

export default PlayerComponent;
