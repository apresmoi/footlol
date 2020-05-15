import React, { useContext } from 'react';
import PlayerComponent from './Objects/Player'
import EffectComponent from './Objects/Effect'
import BallComponent from './Objects/Ball'
import GoalComponent from './Objects/Goal'
import FieldComponent from './Objects/Field';
import { ApplicationContext } from '../../store';


const Draw = () => {
  const { players, self, ball, effects, debug } = useContext(ApplicationContext)
  const playerList = Object.keys(players).map(k => players[k])
  return (
    <>
      <FieldComponent />
      <GoalComponent side="LEFT" />
      <GoalComponent side="RIGHT" />
      <g>
        {/* {debug.map((effect, i) => <EffectComponent key={i} effect={effect} self={self} players={playerList} />)} */}
        {effects.map((effect, i) => <EffectComponent key={i} effect={effect} self={self} players={playerList} />)}
        {ball && <BallComponent ball={ball} />}
        {Object.keys(players)
          .filter(id => self ? self.id !== id : true)
          .map(id => <PlayerComponent key={id} player={players[id]} teammate={!self || players[id].side === self.side} />)}
        {self && <PlayerComponent isSelf player={self} />}
      </g>
    </>
  );
}

export default Draw;
