import React from 'react';
import { Player, Ball, Score } from '../types'
import debounce from 'lodash/debounce'

import chatSocket, {
  requestDirectionChange,
  requestSendMessage,
  subscribeLoginSuccess,
  subscribePlayerJoin,
  subscribePositionChange,
  subscribeSendMessage,
  subscribePlayerLeave,
  subscribeUpdate,
  requestKeyPress
} from '../socket'

interface ActionsWrapperProps {
  children?: any
}

interface ActionsWrapperState {
  self?: Player
  ball?: Ball
  score?: Score
  time?: number
  players: { [x: string]: Player }
}

class ActionsWrapper extends React.Component<ActionsWrapperProps, ActionsWrapperState> {
  constructor(props) {
    super(props)
    this.state = {
      self: null,
      ball: null,
      score: { left: 0, right: 0 },
      players: {},
    }
  }

  componentDidMount() {
    subscribeLoginSuccess((player) => {
      //@ts-ignore
      this.setState({ ...this.state, self: { ...player, direction: { x: 0, y: 0 } }, players: player.players, ball: player.ball })
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
    subscribeUpdate(({ players, ball, score, time }) => {
      this.setState({
        ...this.state,
        players,
        ball,
        score,
        time,
        self: this.state.self ? { ...players[this.state.self.id], direction: this.state.self.direction } : null
      })
    })
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
            score: this.state.score,
            time: this.state.time,

            width: this.props['width'],
            height: this.props['height'],
          })
        return null
      })}
    </>
  }
}

export default ActionsWrapper;
