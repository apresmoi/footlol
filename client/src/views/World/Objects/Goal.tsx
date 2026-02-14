import React from 'react';
import { mapSize } from '../../../settings';

interface GoalComponentProps {
  side: 'LEFT' | 'RIGHT'
}

const GoalComponent = (props: GoalComponentProps) => {
  const { side } = props
  const sideDirection = side === 'LEFT' ? -1 : 1
  const idPrefix = `goal-${side.toLowerCase()}`

  const top = -mapSize.goal.height / 2
  const bottom = mapSize.goal.height / 2
  const goalDepth = mapSize.goal.width
  const outerX = sideDirection * goalDepth
  const centerY = (top + bottom) / 2

  const rightPoints = [[0, top], [goalDepth, top + 5], [goalDepth, bottom - 5], [0, bottom]];
  const leftPoints = [[0, bottom], [-goalDepth, bottom - 5], [-goalDepth, top + 5], [0, top]];
  const framePoints = side === 'LEFT' ? leftPoints : rightPoints
  const framePath = framePoints.reduce((result, point, index) => `${result}${index === 0 ? 'M' : 'L'}${point[0]},${point[1]}`, '') + 'Z'
  const accentColor = side === 'LEFT' ? '#69b8ff' : '#ff7396'

  const ribXs = new Array(4).fill(0).map((_, index) => sideDirection * goalDepth * (index + 1) / 5)

  return <g
    className="goal"
    transform={`translate(${
      mapSize.field.x + (side === 'RIGHT' ? mapSize.field.width : 0)
      }, ${
      mapSize.field.y + mapSize.field.height / 2
      })`}
  >
    <defs>
      <linearGradient id={`${idPrefix}-frame-metal`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f7e9c6" />
        <stop offset="42%" stopColor="#bb9554" />
        <stop offset="100%" stopColor="#5f4827" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-panel`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#152237" stopOpacity={0.86} />
        <stop offset="100%" stopColor="#0b1422" stopOpacity={0.72} />
      </linearGradient>
      <linearGradient id={`${idPrefix}-arcane`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={accentColor} stopOpacity={0.04} />
        <stop offset="100%" stopColor={accentColor} stopOpacity={0.24} />
      </linearGradient>
      <radialGradient id={`${idPrefix}-orb`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f4fbff" stopOpacity={0.95} />
        <stop offset="100%" stopColor={accentColor} stopOpacity={0.78} />
      </radialGradient>
      <radialGradient id={`${idPrefix}-aura`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={accentColor} stopOpacity={0.19} />
        <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
      </radialGradient>
    </defs>

    <ellipse
      cx={outerX / 2}
      cy={centerY}
      rx={Math.abs(goalDepth) * 1.7}
      ry={mapSize.goal.height * 0.35}
      fill={`url(#${idPrefix}-aura)`}
    />

    <path d={framePath} fill={`url(#${idPrefix}-arcane)`} />

    <path
      d={framePath}
      fill={`url(#${idPrefix}-panel)`}
      stroke={`url(#${idPrefix}-frame-metal)`}
      strokeWidth={4.8}
      strokeLinejoin="round"
    />
    <path
      d={framePath}
      stroke="#f5ebcf"
      fill="transparent"
      strokeOpacity={0.23}
      strokeWidth={1.3}
      strokeLinejoin="round"
    />

    {ribXs.map((x, index) => (
      <line
        key={index}
        x1={x}
        y1={top + 20}
        x2={x}
        y2={bottom - 20}
        stroke={accentColor}
        strokeOpacity={0.22}
        strokeWidth={1.2}
      />
    ))}

    <line
      x1={0}
      y1={top}
      x2={0}
      y2={bottom}
      stroke={`url(#${idPrefix}-frame-metal)`}
      strokeWidth={5.4}
      strokeLinecap="round"
    />
    <line
      x1={outerX}
      y1={top + 5}
      x2={outerX}
      y2={bottom - 5}
      stroke={accentColor}
      strokeOpacity={0.34}
      strokeWidth={2}
      strokeLinecap="round"
    />

    <path
      d={`M0,${top + 44} C${sideDirection * 18},${top + 56} ${sideDirection * 18},${top + 86} 0,${top + 102}`}
      fill="none"
      stroke="#f0e1bc"
      strokeOpacity={0.42}
      strokeWidth={1.2}
    />
    <path
      d={`M0,${bottom - 44} C${sideDirection * 18},${bottom - 56} ${sideDirection * 18},${bottom - 86} 0,${bottom - 102}`}
      fill="none"
      stroke="#f0e1bc"
      strokeOpacity={0.42}
      strokeWidth={1.2}
    />

    <circle cx={0} cy={top} r={9} fill={`url(#${idPrefix}-orb)`} stroke="#f7edcf" strokeOpacity={0.88} strokeWidth={1} />
    <circle cx={0} cy={bottom} r={9} fill={`url(#${idPrefix}-orb)`} stroke="#f7edcf" strokeOpacity={0.88} strokeWidth={1} />
    <circle cx={outerX} cy={top + 5} r={5.4} fill={accentColor} fillOpacity={0.44} />
    <circle cx={outerX} cy={bottom - 5} r={5.4} fill={accentColor} fillOpacity={0.44} />
  </g >
}

export default React.memo(GoalComponent);
