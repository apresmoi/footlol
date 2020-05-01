import React, { useState } from 'react'
import { ChromePicker } from 'react-color'
import { Color } from '../../store/types'

interface PopupProps {
  color: Color
  onChange?: (Color) => void
}

const Popup = ({ color, onChange }: PopupProps) => {
  const handleChange = (color) => {
    if (onChange) onChange(color.rgb)
  };

  return <div className="color-picker-popover">
    <ChromePicker
      color={color}
      onChange={handleChange}
    />
  </div>
}

export default Popup