import React, { useContext } from 'react';

import { Vector, Player } from '../../../store/types';
import { ApplicationContext } from '../../../store';

interface KeyboardWrapperProps {
  children?: any
  width?: number
  height?: number
  self?: Player
  requestDirectionChange?: (direction: Vector) => void
  requestKeyPress?: (code: string) => void
}

interface KeyboardWrapperState {
  actionKeysPressed: string[]
  directionKeysPressed: string[]
}

const allowedDirectionKeys = ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight']
const allowedActionKeys = ['Space', 'KeyQ', 'KeyW']

class KeyboardWrapper extends React.Component<KeyboardWrapperProps, KeyboardWrapperState> {
  constructor(props) {
    super(props)
    this.state = {
      actionKeysPressed: [],
      directionKeysPressed: []
    }
  }

  handleDirectionChanged = () => {
    const direction: Vector = { x: 0, y: 0 }
    if (this.state.directionKeysPressed.includes('ArrowLeft'))
      direction.x = -1
    if (this.state.directionKeysPressed.includes('ArrowRight'))
      direction.x = 1
    if (this.state.directionKeysPressed.includes('ArrowUp'))
      direction.y = -1
    if (this.state.directionKeysPressed.includes('ArrowDown'))
      direction.y = 1
    this.props.requestDirectionChange(direction)
  }

  handleKeyUp = (e) => {
    const { code } = e
    if (allowedDirectionKeys.includes(code) || allowedActionKeys.includes(code)) {
      this.setState(state => ({
        actionKeysPressed: state.actionKeysPressed.filter(key => key !== code),
        directionKeysPressed: state.directionKeysPressed.filter(key => key !== code),
      }), this.handleDirectionChanged)
    }
  }
  handleKeyDown = (e) => {
    const { code } = e
    if (allowedDirectionKeys.includes(code)) {
      const { directionKeysPressed } = this.state
      if (!directionKeysPressed.includes(code)) {
        this.setState(state => ({
          directionKeysPressed: [...state.directionKeysPressed, code]
        }), this.handleDirectionChanged)
      }
    } else if (allowedActionKeys.includes(code)) {
      const { actionKeysPressed } = this.state
      if (!actionKeysPressed.includes(code)) {
        this.setState(state => ({
          actionKeysPressed: [...state.actionKeysPressed, code]
        }), () => {
          this.props.requestKeyPress(code)
        })
      }
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
  }

  render() {
    return <>
      {React.Children.map(this.props.children, (child, index) => {
        if (child)
          return React.cloneElement(child, {
            ...this.props,
            ...child.props,
            actionKeysPressed: this.state.actionKeysPressed,
            directionKeysPressed: this.state.directionKeysPressed,

            width: this.props['width'],
            height: this.props['height'],
          })
        return null
      })}
    </>
  }
}

interface IWrappedProps {
  width?: number
  height?: number
  children: any
}

const Wrapped = ({ width, height, children }: IWrappedProps) => {
  return <ApplicationContext.Consumer>
    {state => {
      return <KeyboardWrapper
        self={state.self}
        width={width}
        height={height}
        requestDirectionChange={state.requestDirectionChange}
        requestKeyPress={state.requestKeyPress}
      >
        {children}
      </KeyboardWrapper>
    }}
  </ApplicationContext.Consumer>
}


export default Wrapped;
