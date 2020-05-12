import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ApplicationContext } from '../../../store'

interface VictoryProps {
  width?: number
  height?: number
}

const Victory = (props: VictoryProps) => {
  const context = useContext(ApplicationContext)
  // const handleClick = () => {
  //   context.requestPlayerReady(true)
  // }

  console.log(context.victory)
  if (!context.victory || !context.self) return null
  if (context.victory && context.self && context.self.side !== context.victory) return null
  return (
    <g className="victory-logo">
      <defs>
        <pattern id={"victory_logo"} x="-5%" y="-5%" height="105%" width="105%"
          viewBox="0 0 120 120">
          <image x="0" y="0" width="120" height="120" xlinkHref={`http://${window.location.host}/logo/victory.png`}></image>
        </pattern>
        <defs>
          <linearGradient id="leave_button_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bb260e" stopOpacity={1} />
            <stop offset="100%" stopColor="#98211a" stopOpacity={1} />
          </linearGradient>
        </defs>
      </defs>
      <rect x={0} y={0} width={props.width} height={props.height} fill="black" opacity={0.3} />
      <rect x={30} y={0} width={props.width} height={props.height} fill="url(#victory_logo)" />

      {/* <g onClick={handleClick} className="leave-button" transform={`translate(${props.width / 2 - props.width * 0.05}, ${props.height * 3 / 4 - 30})`}>
        <path
          x={0} y={0}
          fill={"url(#leave_button_gradient)"}
          d={`M-10,0 L${props.width * 0.1 + 10},${0} L${props.width * 0.1},${props.width * 0.03} L${0},${props.width * 0.03} Z`}
        />
        <text
          x={props.width * 0.05}
          y={props.width * 0.015}
          textAnchor="middle"
          alignmentBaseline="middle"
          color={'white'}
          fontWeight={600}
        >
          CONTINUE
        </text>
      </g> */}
    </g>
  )
}

export default Victory