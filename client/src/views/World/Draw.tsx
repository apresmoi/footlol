import React from 'react';
import PlayerComponent from './Player'
import { Player } from './types';

interface DrawProps {
  players?: { [x: string]: Player }
  self?: Player
}

const Draw = (props: DrawProps) => {
  const { players, self } = props
  return (
    <div className="world"
    >
      <svg
        viewBox={"0 0 500 500"}
      >
        <g transform="translate(250, 250)">
          {Object.keys(players)
            .filter(id => self ? self.id !== id : true)
            .map(id => <PlayerComponent key={id} player={players[id]} />)}
          {self && <PlayerComponent isSelf player={self} />}
        </g>
      </svg>
    </div>
  );
}

export default Draw;
