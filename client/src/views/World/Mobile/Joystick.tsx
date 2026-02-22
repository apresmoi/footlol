import React, { useCallback, useRef } from 'react'
import { Vector } from '../../../store/types'

interface JoystickProps {
  onDirectionChange: (direction: Vector) => void
}

const BASE_SIZE = 130
const KNOB_SIZE = 50
const MAX_DISTANCE = (BASE_SIZE - KNOB_SIZE) / 2
const DEAD_ZONE = 0.25

const Joystick = ({ onDirectionChange }: JoystickProps) => {
  const baseRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const activeTouchRef = useRef<number | null>(null)
  const lastDirRef = useRef<string>('0,0')

  const getDirection = (dx: number, dy: number): Vector => {
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < DEAD_ZONE * MAX_DISTANCE) return { x: 0, y: 0 }

    const nx = dx / dist
    const ny = dy / dist

    return {
      x: Math.abs(nx) > 0.38 ? (nx > 0 ? 1 : -1) : 0,
      y: Math.abs(ny) > 0.38 ? (ny > 0 ? 1 : -1) : 0,
    }
  }

  const updateKnob = (dx: number, dy: number) => {
    if (!knobRef.current) return
    const dist = Math.sqrt(dx * dx + dy * dy)
    const clamped = Math.min(dist, MAX_DISTANCE)
    const scale = dist > 0 ? clamped / dist : 0
    const cx = dx * scale
    const cy = dy * scale
    knobRef.current.style.transform = `translate(${cx}px, ${cy}px)`
  }

  const emitDirection = useCallback((dx: number, dy: number) => {
    const dir = getDirection(dx, dy)
    const key = `${dir.x},${dir.y}`
    if (key !== lastDirRef.current) {
      lastDirRef.current = key
      onDirectionChange(dir)
    }
  }, [onDirectionChange])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (activeTouchRef.current !== null) return
    const touch = e.changedTouches[0]
    activeTouchRef.current = touch.identifier
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const base = baseRef.current
    if (!base || activeTouchRef.current === null) return

    let touch: React.Touch | null = null
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === activeTouchRef.current) {
        touch = e.touches[i]
        break
      }
    }
    if (!touch) return

    const rect = base.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = touch.clientX - centerX
    const dy = touch.clientY - centerY

    updateKnob(dx, dy)
    emitDirection(dx, dy)
  }, [emitDirection])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    let found = false
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === activeTouchRef.current) {
        found = true
        break
      }
    }
    if (!found) {
      activeTouchRef.current = null
      if (knobRef.current) knobRef.current.style.transform = 'translate(0px, 0px)'
      lastDirRef.current = '0,0'
      onDirectionChange({ x: 0, y: 0 })
    }
  }, [onDirectionChange])

  return (
    <div
      className="joystick"
      ref={baseRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="joystick-base" />
      <div className="joystick-knob" ref={knobRef} />
    </div>
  )
}

export default Joystick
