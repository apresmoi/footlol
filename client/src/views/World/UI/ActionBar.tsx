import React, { useContext } from 'react'
import { ApplicationContext } from '../../../store'

interface ActionBarProps {
  width?: number
  height?: number
  actionKeysPressed?: string[]
}

const ActionBar = (props: ActionBarProps) => {
  const { champions, self } = useContext(ApplicationContext)
  if (!self) return null

  const champion = champions.find((row) => row.name === self.champion)
  if (!champion) return null

  const centerX = (props.width || 0) / 2
  const baseY = (props.height || 0) - 128

  return (
    <g transform={`translate(${centerX}, ${baseY})`}>
      <defs>
        <pattern id="hud-player-image" x="-5%" y="-5%" height="105%" width="105%" viewBox="0 0 120 120">
          <image
            x="0"
            y="0"
            width="120"
            height="120"
            xlinkHref={`${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${self.champion}.png`}
          />
        </pattern>

        <pattern
          id="hud-spell-q"
          x="-5%"
          y="-5%"
          height="105%"
          width="105%"
          viewBox={`${champion.spells.Q.x} ${champion.spells.Q.y} ${champion.spells.Q.w} ${champion.spells.Q.h}`}
        >
          <image x="0" y="0" width="480" height="192" xlinkHref={`${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/sprite/${champion.spells.Q.sprite}`} />
        </pattern>

        <pattern
          id="hud-spell-w"
          x="-5%"
          y="-5%"
          height="105%"
          width="105%"
          viewBox={`${champion.spells.W.x} ${champion.spells.W.y} ${champion.spells.W.w} ${champion.spells.W.h}`}
        >
          <image x="0" y="0" width="480" height="192" xlinkHref={`${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/sprite/${champion.spells.W.sprite}`} />
        </pattern>

        <linearGradient id="hud-bar-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(8, 22, 30, 0.96)" />
          <stop offset="100%" stopColor="rgba(6, 12, 20, 0.97)" />
        </linearGradient>
        <linearGradient id="hud-bar-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4e8c4" />
          <stop offset="50%" stopColor="#b6924e" />
          <stop offset="100%" stopColor="#6b5228" />
        </linearGradient>
        <linearGradient id="hp-fill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2c9e43" />
          <stop offset="100%" stopColor="#67d46d" />
        </linearGradient>
      </defs>

      <path
        d="M-205,22 L-188,10 L180,10 L198,22 L198,90 L-205,90 Z"
        fill="url(#hud-bar-bg)"
        stroke="url(#hud-bar-gold)"
        strokeWidth={2.3}
      />
      <line x1={-205} y1={56} x2={198} y2={56} stroke="rgba(155, 190, 216, 0.18)" strokeWidth={1} />

      <circle cx={-160} cy={50} r={44} fill="rgba(6, 12, 20, 0.98)" stroke="url(#hud-bar-gold)" strokeWidth={4} />
      <circle cx={-160} cy={50} r={38} fill="url(#hud-player-image)" />
      <circle cx={-160} cy={50} r={41} fill="transparent" stroke="rgba(96, 156, 212, 0.3)" strokeWidth={2} />

      <rect x={-78} y={68} width={250} height={12} rx={6} fill="rgba(9, 23, 13, 0.92)" stroke="rgba(91, 169, 99, 0.45)" />
      <rect x={-76} y={70} width={164} height={8} rx={4} fill="url(#hp-fill)" />

      <SkillSlot
        x={-56}
        y={20}
        id="hud-spell-q"
        hotkey="Q"
        cooldown={self.cooldown.Q}
        pressed={Boolean(props.actionKeysPressed && props.actionKeysPressed.includes('KeyQ'))}
      />
      <SkillSlot
        x={8}
        y={20}
        id="hud-spell-w"
        hotkey="W"
        cooldown={self.cooldown.W}
        pressed={Boolean(props.actionKeysPressed && props.actionKeysPressed.includes('KeyW'))}
      />
      <SkillSlot
        x={72}
        y={20}
        id=""
        hotkey="SPACE"
        cooldown={0}
        pressed={Boolean(props.actionKeysPressed && props.actionKeysPressed.includes('Space'))}
        isKick
      />
    </g>
  )
}

interface SkillSlotProps {
  x: number
  y: number
  id: string
  hotkey: string
  cooldown: number
  pressed: boolean
  isKick?: boolean
}

const SkillSlot = ({ id, x, y, pressed, cooldown, hotkey, isKick = false }: SkillSlotProps) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={0} y={0} width={56} height={56} rx={6} fill="rgba(7, 14, 24, 0.95)" stroke="rgba(236, 213, 157, 0.45)" />
      {isKick
        ? <text x={28} y={34} textAnchor="middle" fontFamily="Cinzel, serif" fontWeight={700} fontSize={14} fill="#e5c88b">KICK</text>
        : <rect x={4} y={4} width={48} height={48} rx={4} fill={`url(#${id})`} />}

      <rect x={4} y={4} width={48} height={48} rx={4} fill="transparent" stroke="rgba(160, 202, 234, 0.42)" />
      {pressed && <rect x={2.5} y={2.5} width={51} height={51} rx={6} fill="transparent" stroke="#e7c982" strokeWidth={2} />}

      <rect x={4} y={4} width={22} height={13} rx={3} fill="rgba(5, 11, 19, 0.88)" />
      <text x={15} y={13} textAnchor="middle" fontFamily="Rajdhani, sans-serif" fontSize={9} fontWeight={700} fill="#d4b97a">
        {hotkey}
      </text>

      {cooldown > 0 && (
        <g>
          <rect x={4} y={4} width={48} height={48} rx={4} fill="#000" opacity={0.65} />
          <text
            x={28}
            y={33}
            textAnchor="middle"
            fontFamily="Rajdhani, sans-serif"
            fontWeight={700}
            fontSize={20}
            fill="#eaf6ff"
          >
            {cooldown}
          </text>
        </g>
      )}
    </g>
  )
}

export default ActionBar
