import React from 'react'
import { mapSize, pallete } from "../../../settings"
import { Player, Ball, Score as MatchScore } from '../../../store/types'

interface ScoreProps {
  players?: { [x: string]: Player }
  self?: Player
  ball?: Ball
  score?: MatchScore
  time?: number
  width?: number
  height?: number
}

const Score = (props: ScoreProps) => {
  if (!props.score) return null

  const minutes = Math.trunc(props.time / 60)
  const seconds = Math.floor(props.time - minutes * 60)

  return (
    <g transform={`translate(${props.width / 2}, ${0})`}>
      <polygon transform={`translate(-100,0)`} points={'0,0 200,0 200,70 0,70'} fill={'black'} opacity={0.3} />
      <text
        x={-50}
        y={40}
        textAnchor={"middle"}
        fontSize={40}
        fill={'white'}
      >{props.score.left}</text>

      <text
        x={50}
        y={40}
        textAnchor={'middle'}
        fontSize={40}
        fill={'white'}
      >{props.score.right}</text>

      <text
        x={0}
        y={65}
        textAnchor={'middle'}
        fontSize={20}
        fill={'white'}
      >
        {minutes + ":" + (seconds < 10 ? "0" : "") + seconds}
      </text>
    </g>
  )
}

export default Score