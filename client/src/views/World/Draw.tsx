import React, { useContext, useMemo } from 'react';
import PlayerComponent, { championPatternId, PLAYER_NAME_FILTER_ID } from './Objects/Player'
import EffectComponent from './Objects/Effect'
import BallComponent from './Objects/Ball'
import GoalComponent from './Objects/Goal'
import FieldComponent from './Objects/Field';
import { ApplicationContext } from '../../store';
import { Effect, Player } from '../../store/types';

const championImageUrl = (champion: string) =>
  `${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${champion}.png`

const getEffectKey = (effect: Effect, index: number) => effect.instanceId ? `${effect.instanceId}` : `${effect.id}-${index}`

const Draw = () => {
  const { players, self, ball, effects, debug } = useContext(ApplicationContext)
  const playerList = useMemo(() => Object.values(players), [players])

  const championNames = useMemo(() => {
    const names = new Set<string>()
    playerList.forEach((player: Player) => {
      if (player.champion) names.add(player.champion)
    })
    if (self?.champion) names.add(self.champion)
    return Array.from(names)
  }, [playerList, self?.champion])

  const opponents = useMemo(() =>
    Object.keys(players).filter(id => self ? self.id !== id : true)
    , [players, self])

  return (
    <>
      <defs>
        <filter x="-5%" y="0%" width="110%" height="120%" id={PLAYER_NAME_FILTER_ID}>
          <feFlood floodColor="black" />
          <feComposite in="SourceGraphic" operator="and" />
        </filter>
        {championNames.map((champion) => (
          <pattern
            id={championPatternId(champion)}
            key={champion}
            x="-5%"
            y="-5%"
            height="105%"
            width="105%"
            viewBox="0 0 120 120"
          >
            <image x="0" y="0" width="120" height="120" xlinkHref={championImageUrl(champion)} />
          </pattern>
        ))}
      </defs>
      <FieldComponent />
      <GoalComponent side="LEFT" />
      <GoalComponent side="RIGHT" />
      <g>
        {debug.map((effect, i) => <EffectComponent key={`debug-${getEffectKey(effect, i)}`} effect={effect} self={self} players={playerList} />)}
        {effects.map((effect, i) => <EffectComponent key={`effect-${getEffectKey(effect, i)}`} effect={effect} self={self} players={playerList} />)}
        {ball && <BallComponent ball={ball} />}
        {opponents.map(id => <PlayerComponent key={id} player={players[id]} teammate={!self || players[id].side === self.side} />)}
        {self && <PlayerComponent isSelf player={self} />}
      </g>
    </>
  );
}

export default Draw;
