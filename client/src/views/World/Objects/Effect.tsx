import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player, CircleEffect, RectEffect, CompoundEffect, Effect } from '../../../store/types'
import { pallete } from '../../../settings';
import { VeigarW, VeigarQ } from './Skills/Veigar';


const EffectComponent = (props: { effect }) => {
  const { effect } = props

  if (effect.id === "VeigarEventHorizon") return <VeigarW effect={effect} />
  else if(effect.id === "VeigarBalefulStrike") return <VeigarQ effect={effect} />

  return <g
    transform={`translate(${effect.position.x}, ${effect.position.y})`}
  >
    <defs>
      {/* <pattern id={`${player.id}_image`} x="-5%" y="-5%" height="105%" width="105%"
        viewBox="0 0 120 120">
        <image x="0" y="0" width="120" height="120" xlinkHref={`http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${player.champion}.png`}></image>
      </pattern>
      <filter x="-5%" y="0%" width="110%" height="120%" id={`${player.id}_name_background`}>
        <feFlood flood-color="black" />
        <feComposite in="SourceGraphic" operator="and" />
      </filter> */}
    </defs>
    {effect.type === 'circle' && <circle cx={0} cy={0} r={effect.radius} />}
    {effect.type === 'rect' && <rect cx={-effect.width / 2} cy={-effect.height / 2} width={effect.width} height={effect.height} />}
  </g >
}

export default EffectComponent;
