import React, { useState, useEffect } from 'react'
import { ApplicationContext } from '.'
import RoomSocket from './socket'
import { Vector, RoomStage, ApplicationContextProviderState, Champion, Player } from './types';
import { useHistory } from 'react-router-dom';
import { mapSize } from '../settings';

const localStorageData: {
  name: string
} = localStorage.getItem('game') ? JSON.parse(localStorage.getItem('game')) : { 'name': "" }

let socket: RoomSocket = null;

const defaultState = {
  champion: null,
  roomId: null,
  rooms: [],
  champions: [],
  stage: null,
  self: null,
  ball: null,
  score: null,
  time: null,
  players: {}
}

const DEBUG = false
const stage: RoomStage = DEBUG ? 'FIELD' : null
const roomID: string = DEBUG ? '/always-open' : null
const champion: string = DEBUG ? 'Veigar' : null
const defaultSelf: Player = DEBUG ? {
  visible: true,
  champion: 'Veigar', id: '', name: '',
  ready: false, direction: { x: 0, y: 0 }, kicking: false,
  position: { ...mapSize.center }, side: 'LEFT', cooldown: { Q: 10, W: 4 },
  admin: false,
} : null

export const ApplicationContextProvider = ({ children }) => {
  const history = useHistory()

  const name: string = localStorageData && localStorageData.name ? localStorageData.name : ""
  const [state, setState] = useState<ApplicationContextProviderState>({
    name: name,
    champion: champion,
    roomId: roomID,
    rooms: [],
    champions: [],
    stage: stage,
    self: defaultSelf,
    ball: null,
    score: null,
    time: null,
    messages: [],
    players: {},
    effects: [],
    debug: [],
  })

  const changeName = (name: string) => {
    localStorage.setItem('game', JSON.stringify({ name }))
    setState({ ...state, name })
  }

  const changeChampion = (champion: string) => {
    setState({ ...state, champion })
  }

  const connectSocket = (roomId: string) => {
    socket = new RoomSocket(roomId, state.name);
    setState({ ...state, roomId })
    socket.connect()
  }

  const disconnectSocket = () => {
    if (socket) {
      setState({ ...state, roomId: null })
      socket.disconnect()
      socket = null
    }
  }

  useEffect(() => {
    history.listen((location, action) => {
      if (action === "POP" || location.pathname.includes('/room-select'))
        disconnectSocket()
      else if (location.pathname === "/game" && !socket) {
        history.push("/room-select")
      }
    })
  })

  useEffect(() => {
    updateChampionPool();
  }, [])

  if (socket) {
    socket.subscribeLoginSuccess((payload) => {
      setState({
        ...state,
        ...payload,
      })
    })
    socket.subscribePlayerJoin((player) => {
      setState({
        ...state,
        players: { ...state.players, [player.id]: player },
        messages: [...state.messages, {
          name: "GameServer",
          message: `Player ${player.name} has joined.`
        }]
      })
    })
    socket.subscribePositionChange((player) => {
      setState({
        ...state,
        players: { ...state.players, [player.id]: player }
      })
    })
    socket.subscribePlayerLeave((player) => {
      const newMessages = state.players[player.id] ? [...state.messages, {
        name: "GameServer",
        message: `Player ${state.players[player.id].name} left.`
      }] : state.messages
      setState({
        ...state,
        players: Object.keys(state.players).reduce((result, id) => {
          if (id !== player.id && state.players[id]) result[id] = state.players[id]
          return result
        }, {}),
        messages: newMessages
      })
    })

    socket.subscribePlayerKicked(() => {
      history.push("/room-select")
    })

    socket.subscribeUpdate((payload) => {
      if (payload.stage === 'TEAM_SELECT' && !state.self) {
        socket.disconnect()
        socket = null
        setState({ ...state, ...defaultState })
      }
      else {
        setState({
          ...state,
          ...payload,
          self: state.self ? { ...payload.players[state.self.id] } : state.self
        })
      }
    })

    socket.subscribeMessageSent((payload) => {
      setState({
        ...state,
        messages: [...state.messages, payload]
      })
    })

    socket.subscribeStageChange((payload) => {
      if (payload.stage === 'TEAM_SELECT' && !state.self) {
        socket.disconnect()
        socket = null
        setState({ ...state, ...defaultState })
      }
      else {
        setState({
          ...state,
          stage: payload.stage
        })
      }
    })
  }

  const requestPlayerReady = (ready: boolean) => {
    socket.requestPlayerReady(ready)
  }

  const requestKeyPress = (code: string) => {
    socket.requestKeyPress(code)
  }

  const requestDirectionChange = (direction: Vector) => {
    socket.requestDirectionChange(direction)
  }

  const requestSendMessage = (payload: { message: string }) => {
    socket.requestSendMessage(payload)
  }

  const requestChampionSelect = (champion: string) => {
    socket.requestChampionSelect(champion)
  }

  const requestKickPlayer = (id: string) => {
    socket.requestKickPlayer(id)
  }

  const requestChangeSide = (side: string) => {
    socket.requestChangeSide(side)
  }

  const updateRooms = () => {
    fetch(window.location.protocol + '//' + window.location.host.replace(':8000', '') + ':8081' + '/api/rooms')
      .then(response => response.json())
      .then(rooms => {
        setState({ ...state, rooms })
      }).catch(err => { console.log(err) })
  }

  const updateChampionPool = () => {
    fetch(window.location.protocol + '//' + window.location.host.replace(':8000', '') + ':8081' + '/api/champions')
      .then(response => response.json())
      .then(champions => {
        setState({ ...state, champions })
      }).catch(err => { console.log(err) })
  }

  const createRoom = (name: string) => {
    fetch(
      window.location.protocol + '//' + window.location.host.replace(':8000', '') + ':8081' + '/api/rooms',
      {
        'method': 'POST',
        'body': JSON.stringify({ name: name }),
        'headers': {
          'content-type': 'application/json'
        }
      }
    )
      .then(response => response.json())
      .then(room => {
        if (room.id) {
          connectSocket(room.id)
          history.push("/game")
        }
      }).catch(err => { console.log(err) })
  }


  return (<ApplicationContext.Provider value={{
    ...state,
    changeName, changeChampion,
    connectSocket,
    updateRooms, updateChampionPool, createRoom,

    requestPlayerReady,
    requestKeyPress,
    requestDirectionChange,
    requestSendMessage,
    requestChampionSelect,
    disconnectSocket,
    requestKickPlayer,
    requestChangeSide
  }}>
    {children}
  </ApplicationContext.Provider>)
}