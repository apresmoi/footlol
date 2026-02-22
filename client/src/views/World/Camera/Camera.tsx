import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Player, Ball } from '../../../store/types';
import { mapSize } from '../../../settings'
import { ApplicationContext } from '../../../store';
import MobileControls from '../Mobile/MobileControls';

interface CameraProps {
  children: any
}

const Camera = (props: CameraProps) => {
  const container = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const currentContainer = container.current
    if (!currentContainer) return

    const updateSize = (width: number, height: number) => {
      const nextWidth = Math.round(width)
      const nextHeight = Math.round(height)
      setSize((prev) => {
        if (prev.width === nextWidth && prev.height === nextHeight) return prev
        return { width: nextWidth, height: nextHeight }
      })
    }

    updateSize(currentContainer.clientWidth, currentContainer.clientHeight)

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      updateSize(entry.contentRect.width, entry.contentRect.height)
    });
    observer.observe(currentContainer);

    return () => {
      observer.disconnect();
    }
  }, [])

  return (
    <div className="world" ref={container}>
      <svg
        width={size.width || 1}
        height={size.height || 1}
      >
        {
          React.Children.map(
            props.children, child => {
              if (!React.isValidElement(child)) return child
              return React.cloneElement(child, {
                ...child.props,
                ...size,
              })
            })
        }
      </svg>
      <MobileControls />
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
  const { self, ball } = useContext(ApplicationContext)

  const position = useMemo(() => {
    const width = props.width || 0
    const height = props.height || 0

    if (!width || !height) return { x: 0, y: 0 }

    const minX = width - mapSize.width
    const minY = height - mapSize.height
    const clampX = (x: number) => Math.max(minX, Math.min(0, x))
    const clampY = (y: number) => Math.max(minY, Math.min(0, y))

    if (self) {
      return {
        x: Math.round(clampX(width * (self.side === 'LEFT' ? 0.25 : 0.75) - self.position.x)),
        y: Math.round(clampY(height / 2 - self.position.y))
      }
    }

    if (ball) {
      return {
        x: Math.round(clampX(width / 2 - ball.position.x)),
        y: Math.round(clampY(height / 2 - ball.position.y))
      }
    }

    return { x: 0, y: 0 }
  }, [ball?.position.x, ball?.position.y, props.height, props.width, self?.position.x, self?.position.y, self?.side])

  return (
    <g transform={`translate(${position.x}, ${position.y})`}>
      {props.children}
    </g>
  );
}

export { CameraPosition }
