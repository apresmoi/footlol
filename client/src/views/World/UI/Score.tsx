import React, { useContext } from 'react'
import { mapSize, pallete } from "../../../settings"
import { Player, Ball, Score as MatchScore } from '../../../store/types'
import { ApplicationContext } from '../../../store'

interface ScoreProps {
  width?: number
  height?: number
}

const Score = (props: ScoreProps) => {
  const { score, countdown, time } = useContext(ApplicationContext)

  if (!score) return null

  let minutes = 0
  let seconds = 0
  if (countdown) {
    minutes = Math.trunc(countdown / 60)
    seconds = Math.floor(countdown - minutes * 60)
  }
  else {
    minutes = Math.trunc(time / 60)
    seconds = Math.floor(time - minutes * 60)
  }

  return (
    <g transform={`translate(${props.width / 2}, ${0})`}>
      <polygon transform={`translate(-100,0)`} points={'0,0 200,0 200,70 0,70'} fill={'black'} opacity={0.3} />
      <text
        x={-50}
        y={40}
        textAnchor={"middle"}
        fontSize={40}
        fill={'white'}
      >{score.left}</text>

      <text
        x={50}
        y={40}
        textAnchor={'middle'}
        fontSize={40}
        fill={'white'}
      >{score.right}</text>

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