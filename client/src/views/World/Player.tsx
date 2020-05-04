import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player } from './types'

const PlayerComponent = (props: { player: Player, isSelf?: boolean }) => {
  const { player, isSelf } = props
  return <g
    key={player.name}
    transform={`translate(${player.position.x}, ${player.position.y})`}
  >
    <circle
      cx={-5}
      cy={-5}
      r={10}
      fill={isSelf ? "green" : "white"}
    />
  </g>
}

export default PlayerComponent;
