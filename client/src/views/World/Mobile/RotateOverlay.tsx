import React, { useEffect, useState } from 'react'
import { isTouchDevice } from '../../../utils/isTouchDevice'

const RotateOverlay = () => {
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    if (!isTouchDevice) return

    const mql = window.matchMedia('(orientation: portrait)')
    const update = (e: MediaQueryListEvent | MediaQueryList) => setIsPortrait(e.matches)
    update(mql)
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  if (!isTouchDevice || !isPortrait) return null

  return (
    <div className="rotate-overlay">
      <div className="rotate-overlay-content">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="18" y="8" width="44" height="64" rx="6" stroke="#c6a65e" strokeWidth="2.5" fill="none" />
          <path d="M56 56 L68 44" stroke="#c6a65e" strokeWidth="2" strokeLinecap="round" />
          <path d="M68 44 L68 54 L58 54" stroke="#c6a65e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <p>Rotate your device to play</p>
      </div>
    </div>
  )
}

export default RotateOverlay
