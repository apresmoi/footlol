import React from 'react';
import { Ball } from '../../../store/types'
import { mapSize } from '../../../settings';

interface GoalComponentProps {
  side: 'LEFT' | 'RIGHT'
}

const GoalComponent = (props: GoalComponentProps) => {
  const { side } = props

  const top = -mapSize.goal.height / 2
  const bottom = mapSize.goal.height / 2

  const rightPoints = [[0, top], [mapSize.goal.width, top + 5], [mapSize.goal.width, bottom - 5], [0, bottom]];
  const leftPoints = [[0, bottom], [-mapSize.goal.width, bottom - 5], [-mapSize.goal.width, top + 5], [0, top]];

  return <g
    className="goal"
    transform={`translate(${
      mapSize.field.x + (side === 'RIGHT' ? mapSize.field.width : 0)
      }, ${
      mapSize.field.y + mapSize.field.height / 2
      })`}
  >
    <circle
      cx={0}
      cy={top}
      r={10}
      fill={"white"}
    />
    <circle
      cx={0}
      cy={bottom}
      r={10}
      fill={"white"}
    />
    <path
      d={(side === 'LEFT' ? leftPoints : rightPoints).reduce((r, point, i) => r + `${i === 0 ? "M" : "L"}${point[0]},${point[1]}`, "")}
      stroke="white"
      fill="transparent"
      strokeWidth={3}
    />
  </g >
}

export default GoalComponent;
