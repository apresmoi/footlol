import React from 'react';
import PlayerComponent from './Objects/Player'
import BallComponent from './Objects/Ball'
import GoalComponent from './Objects/Goal'
import FieldComponent from './Objects/Field';
import { Player, Ball } from './types';
import { mapSize } from '../../settings'

interface DrawProps {
  players?: { [x: string]: Player }
  self?: Player
  ball?: Ball
}

const Draw = (props: DrawProps) => {
  const { players, self, ball } = props
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
      </g>
    </>
  );
}

export default Draw;
