import React from 'react';
import PlayerComponent from './Player'
import BallComponent from './Ball'
import { Player, Ball } from './types';

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

const [width, height] = [900, 300]

const goalArea1 = [
  [40, 50], [0, 50], [0, 250], [40, 250]
]

const goalArea2 = [
  [860, 50], [900, 50], [900, 250], [860, 250]
]


const Draw = (props: DrawProps) => {
  const { players, self, ball } = props
  return (
    <div className="world"
    >
      <svg
        viewBox={`0 0 ${(width + 50)} ${(height + 50)}`}
      >
        <rect width={width + 50} height={height + 50} fill={pallete.dark} />
        <g transform="translate(25, 25)">
          <g>
            <path d={goalArea1.reduce((r, p, i) => r + (i !== 0 ? ' L' : '') + p.join(' '), 'M')} fill='none' stroke={pallete.darker} strokeWidth={10} />
            <path d={goalArea2.reduce((r, p, i) => r + (i !== 0 ? ' L' : '') + p.join(' '), 'M')} fill='none' stroke={pallete.darker} strokeWidth={10} />
          </g>
          <g>
            {ball && <BallComponent ball={ball} />}
            {Object.keys(players)
              .filter(id => self ? self.id !== id : true)
              .map(id => <PlayerComponent key={id} player={players[id]} />)}
            {self && <PlayerComponent isSelf player={self} />}
          </g>
        </g>
      </svg>
    </div>
  );
}

export default Draw;
