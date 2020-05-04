import React from 'react';

interface KeyboardWrapperProps {
  children?: any
}

interface KeyboardWrapperState {
  keysPressed: string[]
}

const allowedKeys = ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight']

class KeyboardWrapper extends React.Component<KeyboardWrapperProps, KeyboardWrapperState> {
  constructor(props) {
    super(props)
    this.state = {
      keysPressed: []
    }
  }

  handleKeyUp = (e) => {
    if (allowedKeys.includes(e.key)) {
      this.setState(state => ({
        keysPressed: state.keysPressed.filter(key => key !== e.key)
      }))
    }
  }
  handleKeyDown = (e) => {
    if (allowedKeys.includes(e.key)) {
      const { keysPressed } = this.state
      if (!keysPressed.includes(e.key)) {
        this.setState(state => ({
          keysPressed: [...state.keysPressed, e.key]
        }))
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
            ...child.props,
            keysPressed: this.state.keysPressed,
          })
        return null
      })}
    </>
  }
}

export default KeyboardWrapper;
