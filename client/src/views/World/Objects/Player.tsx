import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player } from '../../../store/types'
import { pallete } from '../../../settings';


const PlayerComponent = (props: { player: Player, isSelf?: boolean, teammate?: boolean }) => {
  const { player, isSelf, teammate } = props
  const fill = (() => {
    if (isSelf) {
      return 'yellow'
    }
    else if (player.side === "LEFT") {
      return 'blue'
    }
    return 'red'
  })()

  const rotate = (() => {
    if (player.direction.x === 0)
      return player.direction.y > 0 ? 90 : -90
    return (Math.sign(player.direction.x) === -1 ? -180 : 0) + Math.atan(player.direction.y / player.direction.x) * 180 / Math.PI
  })()

  return <g
    className={"player " + (!player.visible ? "invisible" : "") + (isSelf || teammate ? " self" : "")}
    key={player.id}
    transform={`translate(${player.position.x}, ${player.position.y})`}
  >
    <defs>
      <pattern id={`${player.id}_image`} x="-5%" y="-5%" height="105%" width="105%"
        viewBox="0 0 120 120">
        <image x="0" y="0" width="120" height="120" xlinkHref={`${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${player.champion}.png`}></image>
      </pattern>
      <filter x="-5%" y="0%" width="110%" height="120%" id={`${player.id}_name_background`}>
        <feFlood flood-color="black" />
        <feComposite in="SourceGraphic" operator="and" />
      </filter>
    </defs>
    <circle cx={0} cy={0} r={40} fill={fill} fillOpacity={0.1}
      stroke={'white'}
      strokeDasharray={"4 2"} strokeOpacity={player.kicking ? 1 : 0.3}
    />
    {(player.direction.x || player.direction.y) &&
      <g className="direction" transform={`rotate(${rotate})`}>
        <polygon points={`${0},${-20} ${15},${-20} ${32},${0} ${15},${20} ${0},${20}`} />
      </g>}
    <circle cx={0} cy={0} r={25} />
    <circle cx={0} cy={0} r={23} fill={`url(#${player.id}_image)`} />
    <text fontSize={15} y={-35} filter={`url(#${player.id}_name_background)`} textAnchor="middle" fill='white' >{player.name} </text>
  </g >
}

export default PlayerComponent;
