import React, { useState } from 'react'
import { SketchPicker } from 'react-color'
import { Color } from '../../store/types/'

interface ColorPickerProps {
  color: Color
  onChange?: (Color) => void
  label?: string
}

const ColorPicker = ({ color, onChange, label }: ColorPickerProps) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false)

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker)
  };

  const handleClose = () => {
    setDisplayColorPicker(false)
  };

  const handleChange = (color) => {
    if (onChange) onChange(color.rgb)
  };

  return (
    <div>
      {label && <label>{label}</label>}
      <div className="color-picker">
        <div className="color-display" onClick={handleClick}>
          <div style={{ backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` }} />
        </div>
        {displayColorPicker ? <div className="color-picker-popover">
          <div onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange} />
        </div> : null}
      </div>
    </div>
  )
}

export default ColorPicker

export { default as ColorPickerPopup } from './Popup'