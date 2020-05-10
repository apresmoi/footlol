import React, { useState, useRef, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import debounce from 'lodash/debounce'
import { Player, Ball } from '../types';
import { mapSize } from '../../../settings'

interface CameraProps {
  children: any
}

const Camera = (props: CameraProps) => {
  const container = useRef();
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const currentContainer = container.current
    const updateComputedStyles = () => {
      if (container && container.current) {
        const { width: strWidth, height: strHeight } = window.getComputedStyle(container.current)
        const width = parseInt(strWidth.replace('px', ''))
        const height = parseInt(strHeight.replace('px', ''))
        if (size.width !== width || size.height !== height) {
          console.log('setSize')
          setSize({ width, height })
        }
      }
    }
    const observer = new ResizeObserver(debounce(updateComputedStyles, 100));
    observer.observe(currentContainer);
    return () => {
      observer.unobserve(currentContainer);
    }
  })

  return (
    <div className="world" ref={container}>
      <svg
        width={size.width}
        height={size.height}
      >
        {
          React.Children.map(
            props.children, child => React.cloneElement(child, {
              ...child.props,
              ...size,
            }))
        }
      </svg>
    </div>
  );
}
export default Camera

interface CameraChildProps {
  players?: { [x: string]: Player }
  self?: Player
  ball?: Ball
  width?: number
  height?: number
  children: any
}

const CameraPosition = (props: CameraChildProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const { self, ball } = props;

  const updatePosition = () => {
    if (self) {
      const x = props.width * (self.side === 'LEFT' ? 1 : 3) / 4 - self.position.x
      const y = props.height / 2 - self.position.y

      const edgeX = self.position.x < mapSize.width - self.position.x ? 0 : props.width - mapSize.width
      const edgeY = self.position.y < mapSize.height - self.position.y ? 0 : props.height - mapSize.height

      const newX = x <= 0 && x >= props.width - mapSize.width ? x : edgeX
      const newY = y <= 0 && y >= props.height - mapSize.height ? y : edgeY

      if (newX !== position.x || newY !== position.y)
        setPosition({ ...position, x: newX, y: newY })
    } else if (ball) {
      //spectator mode
      const x = props.width / 2 - ball.position.x
      const y = props.height / 2 - ball.position.y

      const edgeX = ball.position.x < mapSize.width - ball.position.x ? 0 : props.width - mapSize.width
      const edgeY = ball.position.y < mapSize.height - ball.position.y ? 0 : props.height - mapSize.height

      const newX = x <= 0 && x >= props.width - mapSize.width ? x : edgeX
      const newY = y <= 0 && y >= props.height - mapSize.height ? y : edgeY

      if (newX !== position.x || newY !== position.y)
        setPosition({ ...position, x: newX, y: newY })
    }
  }

  useEffect(updatePosition, [self ? self.position : (ball ? ball.position : null), props.width, props.height])

  return (
    <g transform={`translate(${position.x}, ${position.y})`}>
      {
        React.Children.map(
          props.children, child => React.cloneElement(child, {
            ...child.props,
            players: props.players,
            self: props.self,
            ball: props.ball,
          }))
      }
    </g>
  );
}

export { CameraPosition }
