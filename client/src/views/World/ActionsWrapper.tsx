import React from 'react';
import { Player, Ball } from './types'
import debounce from 'lodash/debounce'

import chatSocket, {
  requestDirectionChange,
  requestSendMessage,
  subscribeLoginSuccess,
  subscribePlayerJoin,
  subscribePositionChange,
  subscribeSendMessage,
  subscribePlayerLeave,
  subscribeUpdate

} from './socket'

interface ActionsWrapperProps {
  keysPressed?: string[]
  children?: any
}

interface ActionsWrapperState {
  self?: Player
  ball?: Ball
  players: { [x: string]: Player }
  updater?: NodeJS.Timeout
}

class ActionsWrapper extends React.Component<ActionsWrapperProps, ActionsWrapperState> {
  constructor(props) {
    super(props)
    this.state = {
      self: null,
      ball: null,
      players: {},
      updater: null
    }
  }

  componentDidMount() {
    subscribeLoginSuccess((player) => {
      //@ts-ignore
      this.setState({ ...this.state, self: player, players: player.players, ball: player.ball })
    })
    subscribePlayerJoin((player) => {
      this.setState({ ...this.state, players: { ...this.state.players, [player.id]: player } })
    })
    subscribePositionChange((player) => {
      this.setState({
        ...this.state,
        players: { ...this.state.players, [player.id]: player }
      })
    })
    subscribePlayerLeave((player) => {
      this.setState({
        ...this.state,
        players: Object.keys(this.state.players).reduce((result, id) => {
          if (id !== player.id && this.state.players[id]) result[id] = this.state.players[id]
          return result
        }, {})
      })
    })
    subscribeUpdate(({ players, ball }) => {
      this.setState({
        ...this.state,
        players,
        ball,
        self: { ...players[this.state.self.id], direction: this.state.self.direction }
      })
    })
  }

  onPositionChange = debounce(() => {
    requestDirectionChange(this.state.self.direction.dx, this.state.self.direction.dy)
  })

  componentDidUpdate(prevProps: ActionsWrapperProps, prevState: ActionsWrapperState) {
    const { keysPressed } = this.props
    if (prevProps.keysPressed !== keysPressed) {
      clearInterval(this.state.updater);
      this.setState({
        ...this.state,
        updater: setInterval(() => {
          const newSelf: Player = { ...this.state.self }
          newSelf.direction = { dx: 0, dy: 0 }
          if (keysPressed.includes('ArrowLeft'))
            newSelf.direction.dx = -1
          if (keysPressed.includes('ArrowRight'))
            newSelf.direction.dx = 1
          if (keysPressed.includes('ArrowUp'))
            newSelf.direction.dy = -1
          if (keysPressed.includes('ArrowDown'))
            newSelf.direction.dy = 1

          if (newSelf.direction.dx !== this.state.self.direction.dx ||
            newSelf.direction.dy !== this.state.self.direction.dy)
            this.setState({ ...this.state, self: newSelf }, () => {
              this.onPositionChange()
            })
        }, 20)
      })
    }
  }

  render() {
    return <>
      {React.Children.map(this.props.children, (child, index) => {
        if (child)
          return React.cloneElement(child, {
            ...child.props,
            self: this.state.self,
            players: this.state.players,
            ball: this.state.ball,
          })
        return null
      })}
    </>
  }
}

export default ActionsWrapper;
