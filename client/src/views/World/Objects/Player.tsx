import React from 'react';
import { Player } from '../../../store/types'

export const PLAYER_NAME_FILTER_ID = 'player_name_background'
export const championPatternId = (champion: string) => `champion_${champion.toLowerCase()}_image`

const starPoints = (outer: number, inner: number, spikes: number): string => {
  const points: string[] = []
  const step = Math.PI / spikes
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner
    const angle = i * step - Math.PI / 2
    points.push(`${Math.cos(angle) * radius},${Math.sin(angle) * radius}`)
  }
  return points.join(' ')
}

const stateSignature = (player: Player): string => (player.states || [])
  .map((state) => state.type)
  .sort()
  .join('|')

const PlayerComponent = (props: { player: Player, isSelf?: boolean, teammate?: boolean }) => {
  const { player, isSelf, teammate } = props
  const fill = (() => {
    if (isSelf) {
      return 'yellow'
    }
    else if (player.side === "LEFT") {
      return 'blue'
    }
    return 'red'
  })()

  const rotate = Math.atan2(player.direction.y, player.direction.x) * 180 / Math.PI
  const states = player.states || []
  const frozen = states.some((state) => state.type === 'frozen')
  const stunned = states.some((state) => state.type === 'stunned')
  const feared = states.some((state) => state.type === 'feared')
  const slowed = states.some((state) => state.type === 'slowed')

  const frozenCoreId = `player-${player.id}-frozen-core`
  const frozenHaloId = `player-${player.id}-frozen-halo`
  const frozenSheenId = `player-${player.id}-frozen-sheen`
  const fearAuraId = `player-${player.id}-fear-aura`
  const slowAuraId = `player-${player.id}-slow-aura`

  return <g
    className={"player " + (!player.visible ? "invisible" : "") + (isSelf || teammate ? " self" : "")}
    transform={`translate(${player.position.x}, ${player.position.y})`}
  >
    {(frozen || feared || slowed) && (
      <defs>
        <radialGradient id={frozenCoreId} cx="46%" cy="34%" r="68%">
          <stop offset="0%" stopColor="#ecfbff" stopOpacity={0.9} />
          <stop offset="55%" stopColor="#9edcf8" stopOpacity={0.44} />
          <stop offset="100%" stopColor="#64b5e8" stopOpacity={0.08} />
        </radialGradient>
        <radialGradient id={frozenHaloId} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#dbf7ff" stopOpacity={0.34} />
          <stop offset="100%" stopColor="#6dc2f2" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={frozenSheenId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.8} />
          <stop offset="45%" stopColor="#d2efff" stopOpacity={0.24} />
          <stop offset="100%" stopColor="#9dd5f6" stopOpacity={0} />
        </linearGradient>
        <radialGradient id={fearAuraId} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#cb98ff" stopOpacity={0.28} />
          <stop offset="65%" stopColor="#7d4ec7" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#3f235a" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={slowAuraId} cx="50%" cy="50%" r="57%">
          <stop offset="0%" stopColor="#bbf6ff" stopOpacity={0.28} />
          <stop offset="70%" stopColor="#76d5f0" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#2f6d95" stopOpacity={0} />
        </radialGradient>
      </defs>
    )}

    <circle cx={0} cy={0} r={40} fill={fill} fillOpacity={0.1}
      stroke={'white'}
      strokeDasharray={"4 2"} strokeOpacity={player.kicking ? 1 : 0.3}
    />
    {(player.direction.x || player.direction.y) &&
      <g className="direction" transform={`rotate(${rotate})`}>
        <polygon points={`${0},${-20} ${15},${-20} ${32},${0} ${15},${20} ${0},${20}`} />
      </g>}
    <circle cx={0} cy={0} r={25} />
    <circle cx={0} cy={0} r={23} fill={`url(#${championPatternId(player.champion)})`} />

    {frozen && <>
      <circle cx={0} cy={0} r={29} fill={`url(#${frozenHaloId})`} />
      <circle cx={0} cy={0} r={24.4} fill={`url(#${frozenCoreId})`} />
      <ellipse cx={-5} cy={-8} rx={12.8} ry={6.4} fill={`url(#${frozenSheenId})`} transform="rotate(-20)" />
      <circle cx={0} cy={0} r={26.5} fill="none" stroke="rgba(214, 245, 255, 0.9)" strokeWidth={1.15} />
      <circle cx={0} cy={0} r={28} fill="none" stroke="rgba(201, 236, 255, 0.68)" strokeWidth={1} strokeDasharray="1.6 6.1" />

      <g>
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 0 0" to="360 0 0" dur="2.4s" repeatCount="indefinite" />
        {[0, 50, 100, 150, 200, 250, 300, 350].map((angle, index) => {
          const rad = angle * Math.PI / 180
          const x = Math.cos(rad) * 28.8
          const y = Math.sin(rad) * 28.8
          const p1x = Math.cos(rad + 0.18) * 23.5
          const p1y = Math.sin(rad + 0.18) * 23.5
          const p2x = Math.cos(rad - 0.18) * 23.5
          const p2y = Math.sin(rad - 0.18) * 23.5
          return (
            <polygon
              key={index}
              points={`${p1x},${p1y} ${x},${y} ${p2x},${p2y}`}
              fill="rgba(223, 248, 255, 0.75)"
              stroke="rgba(245, 254, 255, 0.84)"
              strokeWidth={0.52}
            />
          )
        })}
      </g>
    </>}

    {stunned && <>
      <circle cx={0} cy={0} r={32} fill="none" stroke="rgba(255, 230, 153, 0.46)" strokeWidth={1.2} strokeDasharray="5 6" />
      <g>
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 0 0" to="360 0 0" dur="0.9s" repeatCount="indefinite" />
        {[0, 120, 240].map((angle, index) => (
          <g key={index} transform={`rotate(${angle}) translate(0,-36)`}>
            <polygon
              points={starPoints(6.2, 2.6, 5)}
              fill="rgba(255, 236, 163, 0.95)"
              stroke="rgba(255, 201, 103, 0.92)"
              strokeWidth={0.68}
            />
          </g>
        ))}
      </g>
    </>}

    {feared && <>
      <circle cx={0} cy={0} r={31.5} fill={`url(#${fearAuraId})`} />
      <circle cx={0} cy={0} r={34} fill="none" stroke="rgba(206, 163, 255, 0.62)" strokeWidth={1.2} strokeDasharray="4 8" />

      <g>
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="360 0 0" to="0 0 0" dur="1.25s" repeatCount="indefinite" />
        {[18, 138, 258].map((angle, index) => (
          <g key={index} transform={`rotate(${angle}) translate(0,-36)`}>
            <path
              d="M0 -3.2 C2.8 -3.2 2.8 0.8 0 0.8 C-2.1 0.8 -2.1 3.4 0 3.4"
              fill="none"
              stroke="rgba(235, 209, 255, 0.88)"
              strokeWidth={1.3}
              strokeLinecap="round"
            />
            <circle cx={0} cy={5.4} r={0.95} fill="rgba(241, 224, 255, 0.92)" />
          </g>
        ))}
      </g>
    </>}

    {slowed && <>
      <circle cx={0} cy={0} r={31} fill={`url(#${slowAuraId})`} />
      <circle cx={0} cy={0} r={33} fill="none" stroke="rgba(135, 227, 250, 0.68)" strokeWidth={1.1} strokeDasharray="3 7" />

      <g>
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="360 0 0" to="0 0 0" dur="1.15s" repeatCount="indefinite" />
        {[0, 72, 144, 216, 288].map((angle, index) => (
          <g key={index} transform={`rotate(${angle}) translate(0,-35.5)`}>
            <path
              d="M-1 0 C1.2 -3.2 3.8 -3.2 6 0"
              fill="none"
              stroke="rgba(188, 243, 255, 0.9)"
              strokeWidth={1.05}
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
    </>}

    <text fontSize={15} y={-35} filter={`url(#${PLAYER_NAME_FILTER_ID})`} textAnchor="middle" fill='white' >{player.name} </text>
  </g >
}

const isPlayerEqual = (
  previousProps: { player: Player, isSelf?: boolean, teammate?: boolean },
  nextProps: { player: Player, isSelf?: boolean, teammate?: boolean }
) => {
  const prev = previousProps.player
  const next = nextProps.player
  return previousProps.isSelf === nextProps.isSelf
    && previousProps.teammate === nextProps.teammate
    && prev.id === next.id
    && prev.name === next.name
    && prev.champion === next.champion
    && prev.visible === next.visible
    && prev.side === next.side
    && prev.kicking === next.kicking
    && prev.position.x === next.position.x
    && prev.position.y === next.position.y
    && prev.direction.x === next.direction.x
    && prev.direction.y === next.direction.y
    && stateSignature(prev) === stateSignature(next)
}

export default React.memo(PlayerComponent, isPlayerEqual);
