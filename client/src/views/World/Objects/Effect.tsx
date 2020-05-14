import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player, CircleEffect, RectEffect, CompoundEffect, Effect } from '../../../store/types'
import { pallete } from '../../../settings';
import { VeigarW, VeigarQ } from './Skills/Veigar';
import { AsheQ, AsheW } from './Skills/Ashe';
import { AmumuQ, AmumuW } from './Skills/Amumu';
import { LeeSinQ, LeeSinW } from './Skills/LeeSin';
import { ThreshQ, ThreshW } from './Skills/Thresh';


const EffectComponent = (props: { effect }) => {
  const { effect } = props

  if (effect.id === "VeigarEventHorizon") return <VeigarW effect={effect} />
  else if (effect.id === "VeigarBalefulStrike") return <VeigarQ effect={effect} />
  else if (effect.id === "Volley") return <AsheQ effect={effect} />
  else if (effect.id === "EnchantedCrystalArrow") return <AsheW effect={effect} />
  else if (effect.id === "BandageToss") return <AmumuQ effect={effect} />
  else if (effect.id === "CurseoftheSadMummy") return <AmumuW effect={effect} />
  else if (effect.id === "BlindMonkQOne") return <LeeSinQ effect={effect} />
  else if (effect.id === "BlindMonkRKick") return <LeeSinW effect={effect} />
  else if (effect.id === "ThreshQ") return <ThreshQ effect={effect} />
  else if (effect.id === "ThreshW") return <ThreshW effect={effect} />
  else if (effect.id) {
    console.log(effect.id)
  }

  return <g
    transform={effect.type !== 'polygon' ? `translate(${effect.position.x}, ${effect.position.y})` : ""}
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
    {(effect.type === 'circle' || !effect.type) && <circle cx={0} cy={0} r={effect.radius || 10} />}
    {effect.type === 'rect' && <rect x={-effect.width / 2} y={-effect.height / 2} width={effect.width} height={effect.height} />}
    {effect.type === 'polygon' && <polygon x={0} y={0} points={effect.points.map(point => point[0] + "," + point[1]).join(' ')} />}
  </g >
}

export default EffectComponent;
