import React, { useContext, useState, useEffect } from 'react'
import { mapSize, pallete } from "../../../settings"
import { Player, Ball, Score as MatchScore } from '../../../store/types'
import { ApplicationContext } from '../../../store'

interface ActionBarProps {
  width?: number
  height?: number
  actionKeysPressed?: string[]
  directionKeysPressed?: string[]
}

const ActionBar = (props: ActionBarProps) => {
  const { champions, self } = useContext(ApplicationContext)
  const champion = champions.find(row => row.name === self.champion)

  if (!self) return null

  return (
    <g transform={`translate(${props.width / 2}, ${props.height - 80})`}>
      {/* <polygon transform={`translate(-110,0)`} points={'0,0 220,0 220,80 0,80'} fill={'white'} /> */}
      <defs>
        <pattern id={`player_image`} x="-5%" y="-5%" height="105%" width="105%"
          viewBox="0 0 120 120">
          <image x="0" y="0" width="120" height="120" xlinkHref={`${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${self.champion}.png`}></image>
        </pattern>


        {/* <pattern id={`spell_pasive`} x="-5%" y="-5%" height="105%" width="105%"
          viewBox="0 0 120 120">
          <image x="0" y="0" width="120" height="120" xlinkHref={`${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${self.champion}.png`}></image>
        </pattern> */}
        <pattern id={`sell_primary`} x="-5%" y="-5%" height="105%" width="105%"
          viewBox={`${champion.spells.Q.x} ${champion.spells.Q.y} ${champion.spells.Q.w} ${champion.spells.Q.h}`}>
          <image x="0" y="0" width="480" height="192" xlinkHref={`${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/sprite/${champion.spells.Q.sprite}`}></image>
        </pattern>
        <pattern id={`spell_secondary`} x="-5%" y="-5%" height="105%" width="105%"
          viewBox={`${champion.spells.W.x} ${champion.spells.W.y} ${champion.spells.W.w} ${champion.spells.W.h}`}>
          <image x="0" y="0" width="480" height="192" xlinkHref={`${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/sprite/${champion.spells.W.sprite}`}></image>
        </pattern>

      </defs>
      {/* background */}
      <polygon transform={`translate(-70,20)`} points={'0,0 175,0 175,60 0,60'} fill={'black'} />
      {/* character */}
      <circle
        cx={-110 + 40}
        cy={40}
        r={40}
        fill={`#000`}
      />
      <circle
        cx={-110 + 40}
        cy={40}
        r={35}
        fill={`url(#player_image)`}
      />
      {/* spells */}
      {/* <Spell x={-50} y={30} id={'spell_pasive'} pressed={false} /> */}
      <Spell x={0} y={30} id={'sell_primary'} cooldown={self.cooldown.Q} pressed={props.actionKeysPressed && props.actionKeysPressed.includes('KeyQ')} />
      <Spell x={55} y={30} id={'spell_secondary'} cooldown={self.cooldown.W} pressed={props.actionKeysPressed && props.actionKeysPressed.includes('KeyW')} />
    </g>
  )
}

const Spell = ({ id, x, y, pressed, cooldown }) => {
  return <g transform={`translate(${x}, ${y})`}>
    <defs>
      <pattern id={id} x="-5%" y="-5%" height="105%" width="105%"
        viewBox="0 0 120 120">
        <image x="0" y="0" width="120" height="120" xlinkHref={`${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/Nami.png`}></image>
      </pattern>
    </defs>
    <rect x={2} y={2} width={40} height={40} fill={`url(#${id})`} />
    <rect x={0} y={0} width={44} height={44} fill='transparent' stroke={`yellow`} strokeWidth={1} />
    {pressed && <rect x={0} y={0} width={44} height={44} fill='transparent' stroke={`white`} strokeWidth={1} />}
    {cooldown && <g>
      <rect x={2} y={2} width={40} height={40} fill={`#black`} opacity={0.8} />
      <text transform={`translate(${22}, ${22})`} textAnchor="middle" alignmentBaseline="middle" fontWeight="bolder" fill="white">
        {cooldown}
      </text>
    </g>}
  </g>
}

export default ActionBar