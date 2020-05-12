import React, { useContext } from 'react';
import { Player, Ball, Score } from '../../../store/types'
import debounce from 'lodash/debounce'
import { ApplicationContext } from '../../../store';

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

// class ActionsWrapper extends React.Component<ActionsWrapperProps, ActionsWrapperState> {
//   constructor(props) {
//     super(props)
//     this.state = {
//       self: null,
//       ball: null,
//       score: { left: 0, right: 0 },
//       players: {},
//     }
//   }

//   render() {
//     return <>
//       {React.Children.map(this.props.children, (child, index) => {
//         if (child)
//           return React.cloneElement(child, {
//             ...child.props,
//             self: this.state.self,
//             players: this.state.players,
//             ball: this.state.ball,
//             score: this.state.score,
//             time: this.state.time,

//             width: this.props['width'],
//             height: this.props['height'],
//           })
//         return null
//       })}
//     </>
//   }
// }


const ActionsWrapper = (props: ActionsWrapperProps) => {
  const context = useContext(ApplicationContext)

  return <>
    {React.Children.map(props.children, (child, index) => {
      if (child)
        return React.cloneElement(child, {
          ...child.props,
          self: context.self,
          players: context.players,
          ball: context.ball,
          score: context.score,
          time: context.time,
          countdown: context.countdown,

          width: props['width'],
          height: props['height'],
        })
      return null
    })}
  </>
}

export default ActionsWrapper;
