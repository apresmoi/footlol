import React, { useContext } from 'react';
import PlayerComponent from './Objects/Player'
import EffectComponent from './Objects/Effect'
import BallComponent from './Objects/Ball'
import GoalComponent from './Objects/Goal'
import FieldComponent from './Objects/Field';
import { ApplicationContext } from '../../store';


const Draw = () => {
  const { players, self, ball, effects, debug } = useContext(ApplicationContext)
  return (
    <>
      <FieldComponent />
      <GoalComponent side="LEFT" />
      <GoalComponent side="RIGHT" />
      <g>
        {ball && <BallComponent ball={ball} />}
        {Object.keys(players)
          .filter(id => self ? self.id !== id : true)
          .map(id => <PlayerComponent key={id} player={players[id]} />)}
        {self && <PlayerComponent isSelf player={self} />}
        {effects.map((effect, i) => <EffectComponent key={i} effect={effect} />)}
        {/* {debug.map((effect, i) => <EffectComponent key={i} effect={effect} />)} */}
      </g>
    </>
  );
}

export default Draw;
