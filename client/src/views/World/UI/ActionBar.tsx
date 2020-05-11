import React from 'react'
import { mapSize, pallete } from "../../../settings"
import { Player, Ball, Score as MatchScore } from '../../../store/types'

interface ActionBarProps {
  players?: { [x: string]: Player }
  self?: Player
  ball?: Ball
  score?: MatchScore
  time?: number
  width?: number
  height?: number

  actionKeysPressed?: string[]
  directionKeysPressed?: string[]
}

const ActionBar = (props: ActionBarProps) => {
  if (!props.self) return null

  console.log(props.actionKeysPressed)
  return (
    <g transform={`translate(${props.width / 2}, ${props.height - 80})`}>
      {/* <polygon transform={`translate(-140,0)`} points={'0,0 280,0 280,80 0,80'} fill={'white'} /> */}
      <defs>
        <pattern id={`player_image`} x="-5%" y="-5%" height="105%" width="105%"
          viewBox="0 0 120 120">
          <image x="0" y="0" width="120" height="120" xlinkHref={`http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${props.self.champion}.png`}></image>
        </pattern>


        <pattern id={`spell_pasive`} x="-5%" y="-5%" height="105%" width="105%"
          viewBox="0 0 120 120">
          <image x="0" y="0" width="120" height="120" xlinkHref={`http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${props.self.champion}.png`}></image>
        </pattern>
        <pattern id={`sell_primary`} x="-5%" y="-5%" height="105%" width="105%"
          viewBox="0 0 120 120">
          <image x="0" y="0" width="120" height="120" xlinkHref={`http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${props.self.champion}.png`}></image>
        </pattern>
        <pattern id={`spell_secondary`} x="-5%" y="-5%" height="105%" width="105%"
          viewBox="0 0 120 120">
          <image x="0" y="0" width="120" height="120" xlinkHref={`http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${props.self.champion}.png`}></image>
        </pattern>
      </defs>
      {/* background */}
      <polygon transform={`translate(-100,20)`} points={'0,0 240,0 240,60 0,60'} fill={'black'} />
      {/* character */}
      <circle
        cx={-140 + 40}
        cy={40}
        r={40}
        fill={`#000`}
      />
      <circle
        cx={-140 + 40}
        cy={40}
        r={35}
        fill={`url(#player_image)`}
      />
      {/* spells */}
      <Spell x={-50} y={30} id={'spell_pasive'} pressed={false} />
      <Spell x={35} y={30} id={'sell_primary'} pressed={props.actionKeysPressed && props.actionKeysPressed.includes('KeyQ')} />
      <Spell x={90} y={30} id={'spell_secondary'} pressed={props.actionKeysPressed && props.actionKeysPressed.includes('KeyW')} />
    </g>
  )
}

const Spell = ({ id, x, y, pressed }) => {
  return <g transform={`translate(${x}, ${y})`}>
    <defs>
      <pattern id={id} x="-5%" y="-5%" height="105%" width="105%"
        viewBox="0 0 120 120">
        <image x="0" y="0" width="120" height="120" xlinkHref={`http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/Nami.png`}></image>
      </pattern>
    </defs>
    <rect x={-5} y={-5} width={50} height={50} fill={`#black`} />
    <rect x={0} y={0} width={40} height={40} fill={`url(#${id})`} />
    {pressed && <rect x={0} y={0} width={40} height={40} fill='transparent' stroke={`white`} strokeWidth={1} />}
  </g>
}

export default ActionBar