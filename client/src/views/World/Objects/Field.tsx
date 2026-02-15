import React from 'react'
import { mapSize } from "../../../settings"

const FIELD_BRAND_FONT = "'Beaufort for LOL', 'Cinzel', serif"

const Field = () => {
  return (
    <>
      <defs>
        <linearGradient id="fieldSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#080c17" />
          <stop offset="100%" stopColor="#0a1322" />
        </linearGradient>
        <linearGradient id="pitchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10283a" />
          <stop offset="55%" stopColor="#0b2031" />
          <stop offset="100%" stopColor="#081828" />
        </linearGradient>
        <pattern id="pitchStripes" width="160" height="830" patternUnits="userSpaceOnUse">
          <rect x={0} y={0} width={80} height={830} fill="rgba(120, 190, 255, 0.045)" />
          <rect x={80} y={0} width={80} height={830} fill="rgba(11, 34, 54, 0.05)" />
        </pattern>
        <radialGradient id="pitchCenterGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(110, 188, 255, 0.18)" />
          <stop offset="100%" stopColor="rgba(110, 188, 255, 0)" />
        </radialGradient>
        <linearGradient id="pitchBrand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(183, 211, 236, 0.22)" />
          <stop offset="100%" stopColor="rgba(88, 143, 192, 0.14)" />
        </linearGradient>
        <clipPath id="pitchBounds">
          <rect
            x={mapSize.field.x}
            y={mapSize.field.y}
            width={mapSize.field.width}
            height={mapSize.field.height}
            rx={8}
          />
        </clipPath>
      </defs>

      <rect {...mapSize} fill="url(#fieldSky)" />

      <rect {...mapSize.field} fill="url(#pitchGradient)" stroke="#163245" strokeWidth={4} rx={8} />
      <rect {...mapSize.field} fill="url(#pitchStripes)" opacity={0.75} />
      <rect
        x={mapSize.field.x}
        y={mapSize.field.y}
        width={mapSize.field.width}
        height={mapSize.field.height}
        fill="url(#pitchCenterGlow)"
      />
      <g clipPath="url(#pitchBounds)">
        <text
          x={mapSize.center.x + 8}
          y={mapSize.center.y + 54}
          textAnchor="middle"
          fontFamily={FIELD_BRAND_FONT}
          fontSize={176}
          fontWeight={700}
          letterSpacing={10}
          fill="rgba(4, 8, 16, 0.3)"
          transform={`rotate(-6 ${mapSize.center.x} ${mapSize.center.y})`}
        >
          FOOTLOL
        </text>
        <text
          x={mapSize.center.x}
          y={mapSize.center.y + 46}
          textAnchor="middle"
          fontFamily={FIELD_BRAND_FONT}
          fontSize={172}
          fontWeight={700}
          letterSpacing={10}
          fill="url(#pitchBrand)"
          stroke="rgba(188, 223, 255, 0.1)"
          strokeWidth={1.2}
          transform={`rotate(-6 ${mapSize.center.x} ${mapSize.center.y})`}
        >
          FOOTLOL
        </text>
      </g>

      <line
        x1={mapSize.center.x}
        x2={mapSize.center.x}
        y1={mapSize.field.y}
        y2={mapSize.field.height + mapSize.field.y}
        stroke="#7eb8ea"
        strokeOpacity={0.72}
        strokeWidth={3}
      />
      <circle
        r={mapSize.center.r}
        cx={mapSize.center.x}
        cy={mapSize.center.y}
        stroke="#8ec5f4"
        strokeOpacity={0.76}
        fill='transparent'
        strokeWidth={3}
      />
      <circle
        r={12}
        cx={mapSize.center.x}
        cy={mapSize.center.y}
        fill="#90d0ff"
        fillOpacity={0.72}
      />
    </>
  )
}

export default React.memo(Field)
