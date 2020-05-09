import React from 'react'
import { mapSize, pallete } from "../../../settings"

const Field = () => {
  return (
    <>
      {/* background */}
      <rect {...mapSize} fill={pallete.dark} />
      <rect {...mapSize.field} fill={pallete.dark} stroke={pallete.darker} strokeWidth={5} />

      {/* center area */}
      <circle
        r={mapSize.center.r}
        cx={mapSize.center.x}
        cy={mapSize.center.y}
        stroke={pallete.lighter} fill='transparent' strokeWidth={5} />
      <line
        x1={mapSize.center.x}
        x2={mapSize.center.x}
        y1={mapSize.field.y}
        y2={mapSize.field.height + mapSize.field.y}
        stroke={pallete.lighter} strokeWidth={5} />
    </>
  )
}

export default Field