import React from 'react';
import { Player } from './types'
import debounce from 'lodash/debounce'

import chatSocket, {
  requestPositionChange,
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
  players: { [x: string]: Player }
  updater?: NodeJS.Timeout
}

class ActionsWrapper extends React.Component<ActionsWrapperProps, ActionsWrapperState> {
  constructor(props) {
    super(props)
    this.state = {
      self: null,
      players: {},
      updater: null
    }
  }

  componentDidMount() {
    subscribeLoginSuccess((player) => {
      //@ts-ignore
      this.setState({ ...this.state, self: player, players: player.players })
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
        players: Object.keys(this.state.players).reduce((players, id, index, arr) => {
          if (id !== player.id && arr[id]) players[id] = arr[id]
          return players
        }, {})
      })
    })
    subscribeUpdate((players) => {
      this.setState({
        ...this.state,
        players,
        self: players[this.state.self.id]
      })
    })
  }

  onPositionChange = debounce(() => {
    requestPositionChange(this.state.self.position.x, this.state.self.position.y)
  })

  componentDidUpdate(prevProps: ActionsWrapperProps, prevState: ActionsWrapperState) {
    const { keysPressed } = this.props
    if (prevProps.keysPressed !== keysPressed) {
      clearInterval(this.state.updater);
      this.setState({
        ...this.state,
        updater: setInterval(() => {
          if (keysPressed.length) {
            const newSelf: Player = { ...this.state.self }
            if (keysPressed.includes('ArrowLeft'))
              newSelf.position.x -= 2
            if (keysPressed.includes('ArrowRight'))
              newSelf.position.x += 2
            if (keysPressed.includes('ArrowUp'))
              newSelf.position.y -= 2
            if (keysPressed.includes('ArrowDown'))
              newSelf.position.y += 2
            this.setState({ ...this.state, self: newSelf }, () => {
              this.onPositionChange()
            })
          }
        }, 20)
      })
    }
  }

  render() {
    console.log(this.state.players)
    return <>
      {React.Children.map(this.props.children, (child, index) => {
        if (child)
          return React.cloneElement(child, {
            ...child.props,
            self: this.state.self,
            players: this.state.players
          })
        return null
      })}
    </>
  }
}

export default ActionsWrapper;
