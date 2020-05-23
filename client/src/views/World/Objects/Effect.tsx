import React from 'react';
import { VeigarW, VeigarQ } from './Skills/Veigar';
import { AsheQ, AsheW } from './Skills/Ashe';
import { AmumuQ, AmumuW } from './Skills/Amumu';
import { LeeSinQ, LeeSinW } from './Skills/LeeSin';
import { ThreshQ, ThreshW } from './Skills/Thresh';
import { ShacoW } from './Skills/Shaco';
import { GarenW } from './Skills/Garen';
import { AniviaW, AniviaQ } from './Skills/Anivia';
import { YasuoW, YasuoQ } from './Skills/Yasuo';
import { MalphiteW, MalphiteQ } from './Skills/Malphite';
import { LucianW } from './Skills/Lucian';
import { AhriQ } from './Skills/Ahri';


const EffectComponent = (props: { effect, self, players }) => {
  const { effect, self, players } = props

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
  else if (effect.id === "JackInTheBox") return <ShacoW effect={effect}
    shacoInTeam={self ? self.champion === "Shaco" || players.some(x => x.side === self.side && x.champion === "Shaco") : true}
  />
  else if (effect.id === "GarenE") return <GarenW effect={effect} />
  else if (effect.id === "FlashFrost") return <AniviaQ effect={effect} />
  else if (effect.id === "Crystallize") return <AniviaW effect={effect} />
  else if (effect.id === "YasuoE") return <YasuoQ effect={effect} />
  else if (effect.id === "YasuoW") return <YasuoW effect={effect} />
  else if (effect.id === "UFSlash") return <MalphiteW effect={effect} />
  else if (effect.id === "Obduracy") return <MalphiteQ effect={effect} />
  else if (effect.id === "LucianE") return <LucianW effect={effect} />
  else if (effect.id === "AhriTumble") return <AhriQ effect={effect} />
  else if (effect.id) {
    console.log(effect.id)
  }


  return <g
    transform={effect.type !== 'polygon' && effect.type !== 'player' ? `translate(${effect.position.x}, ${effect.position.y})` : ""}
  >
    {(effect.type === 'circle' || !effect.type) && <circle cx={0} cy={0} r={effect.radius || 10} />}
    {effect.type === 'rect' && <rect transform={`rotate(${effect.angle * 180 / Math.PI})`} x={-effect.width / 2} y={-effect.height / 2} width={effect.width} height={effect.height} />}
    {effect.type === 'polygon' && <polygon x={0} y={0} points={effect.points.map(point => point[0] + "," + point[1]).join(' ')} />}

    {effect.type === 'player' ? effect.points.map(point => <circle r={10} cx={point[0]} cy={point[1]} />) : null}

  </g >
}

export default EffectComponent;
