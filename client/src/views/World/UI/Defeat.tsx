import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ApplicationContext } from '../../../store'

interface DefeatProps {
  width?: number
  height?: number
}

const Defeat = (props: DefeatProps) => {
  const context = useContext(ApplicationContext)
  if (!context.victory || !context.self) return null
  if (context.victory && context.self && context.self.side === context.victory) return null
  return (
    <g className="defeat-logo">
      <defs>
        <pattern id={"defeat_logo"} x="-5%" y="-5%" height="105%" width="105%"
          viewBox="0 0 120 120">
          <image x="0" y="0" width="120" height="120" xlinkHref={`${window.location.protocol}//${window.location.host}/logo/defeat.png`}></image>
        </pattern>
        <defs>
          <linearGradient id="leave_button_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bb260e" stopOpacity={1} />
            <stop offset="100%" stopColor="#98211a" stopOpacity={1} />
          </linearGradient>
        </defs>
      </defs>
      <rect x={0} y={0} width={props.width} height={props.height} fill="black" opacity={0.3} />
      <rect x={30} y={0} width={props.width} height={props.height} fill="url(#defeat_logo)" />
    </g>
  )
}

export default Defeat