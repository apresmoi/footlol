import React from 'react';
import PlayerComponent from './Player'
import BallComponent from './Ball'
import { Player, Ball } from './types';
import { mapSize } from '../../settings'

interface DrawProps {
  players?: { [x: string]: Player }
  self?: Player
  ball?: Ball
}

const pallete = {
  'light': '#4C6B8F',
  'dark': '#2B3C4F',
  'darker': '#0B151E',
  'lighter': '#7D9EC7'
}

const Draw = (props: DrawProps) => {
  const { players, self, ball } = props
  return (
    <>
      <rect {...mapSize} fill={pallete.dark} stroke={pallete.darker} strokeWidth={10} />
      <g transform="translate(0, 0)">
        <g>
          {ball && <BallComponent ball={ball} />}
          {Object.keys(players)
            .filter(id => self ? self.id !== id : true)
            .map(id => <PlayerComponent key={id} player={players[id]} />)}
          {self && <PlayerComponent isSelf player={self} />}
        </g>
      </g>
    </>
  );
}

export default Draw;
