import React, { useCallback, useRef } from 'react'
import { Player, Champion } from '../../../store/types'

interface ActionButtonsProps {
  onKeyPress: (code: string) => void
  self: Player | undefined
  champions: Champion[]
}

const championImageUrl = (champion: string) =>
  `${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${champion}.png`

const ActionButtons = ({ onKeyPress, self, champions }: ActionButtonsProps) => {
  if (!self) return null

  const champion = champions.find((row) => row.name === self.champion)

  return (
    <div className="action-buttons">
      <ActionBtn
        code="KeyQ"
        label="Q"
        cooldown={self.cooldown.Q}
        onPress={onKeyPress}
        spriteUrl={champion ? `${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/sprite/${champion.spells.Q.sprite}` : undefined}
        spritePos={champion ? champion.spells.Q : undefined}
      />
      <ActionBtn
        code="KeyW"
        label="W"
        cooldown={self.cooldown.W}
        onPress={onKeyPress}
        spriteUrl={champion ? `${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/sprite/${champion.spells.W.sprite}` : undefined}
        spritePos={champion ? champion.spells.W : undefined}
      />
      <ActionBtn
        code="Space"
        label="KICK"
        cooldown={0}
        onPress={onKeyPress}
        isKick
      />
    </div>
  )
}

interface ActionBtnProps {
  code: string
  label: string
  cooldown: number
  onPress: (code: string) => void
  isKick?: boolean
  spriteUrl?: string
  spritePos?: { x: number; y: number; w: number; h: number }
}

const ActionBtn = ({ code, label, cooldown, onPress, isKick, spriteUrl, spritePos }: ActionBtnProps) => {
  const pressedRef = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (!pressedRef.current) {
      pressedRef.current = true
      onPress(code)
    }
  }, [code, onPress])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    pressedRef.current = false
  }, [])

  const hasIcon = spriteUrl && spritePos
  const onCooldown = cooldown > 0

  return (
    <div
      className={`action-btn ${isKick ? 'action-btn--kick' : ''} ${onCooldown ? 'action-btn--cooldown' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {hasIcon && (
        <div
          className="action-btn-icon"
          style={{
            backgroundImage: `url(${spriteUrl})`,
            backgroundPosition: `-${spritePos.x}px -${spritePos.y}px`,
            backgroundSize: '480px 192px',
            width: `${spritePos.w}px`,
            height: `${spritePos.h}px`,
          }}
        />
      )}
      {(isKick || !hasIcon) && <span className="action-btn-label">{label}</span>}
      {onCooldown && (
        <div className="action-btn-cooldown-overlay">
          <span>{cooldown}</span>
        </div>
      )}
      <span className="action-btn-hotkey">{label}</span>
    </div>
  )
}

export default ActionButtons
