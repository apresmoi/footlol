import React, { useState, useCallback } from 'react'
import { Champion, ApplicationContext } from '.'
import RoomSocket from './socket'
import { Vector, PlayerMessage } from './types';

const localStorageData: {
  name: string
} = localStorage.getItem('game') ? JSON.parse(localStorage.getItem('game')) : { 'name': "" }

let socket: RoomSocket = null;

export const ApplicationContextProvider = ({ children }) => {
  const [state, setState] = useState({
    name: localStorageData && localStorageData.name ? localStorageData.name : "",
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
  })

  const changeName = (name: string) => {
    localStorage.setItem('game', JSON.stringify({ name }))
    setState({ ...state, name })
  }

  const changeChampion = (champion: Champion) => {
    setState({ ...state, champion })
  }

  const connectSocket = (roomId: string) => {
    socket = new RoomSocket(roomId, state.name);
    setState({ ...state, roomId, })
    socket.connect()
  }

  if (socket) {
    socket.subscribeLoginSuccess((payload) => {
      setState({
        ...state,
        ...payload
      })
    })
    socket.subscribePlayerJoin((player) => {
      setState({ ...state, players: { ...state.players, [player.id]: player } })
    })
    socket.subscribePositionChange((player) => {
      setState({
        ...state,
        players: { ...state.players, [player.id]: player }
      })
    })
    socket.subscribePlayerLeave((player) => {
      setState({
        ...state,
        players: Object.keys(state.players).reduce((result, id) => {
          if (id !== player.id && state.players[id]) result[id] = state.players[id]
          return result
        }, {})
      })
    })
    socket.subscribeUpdate((payload) => {
      setState({
        ...state,
        ...payload,
        self: state.self ? { ...payload.players[state.self.id], direction: state.self.direction } : state.self
      })
    })

    socket.subscribeStageChange((payload) => {
      setState({
        ...state,
        stage: payload.stage
      })
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

  const updateRooms = () => {
    fetch('http://' + window.location.host.replace(':8000', '') + ':8081' + '/api/rooms')
      .then(response => response.json())
      .then(rooms => {
        console.log(rooms)
        setState({ ...state, rooms })
      }).catch(err => { console.log(err) })
  }

  const updateChampionPool = () => {
    fetch('http://' + window.location.host.replace(':8000', '') + ':8081' + '/api/champions')
      .then(response => response.json())
      .then(champions => {
        console.log(champions)
        setState({ ...state, champions })
      }).catch(err => { console.log(err) })
  }

  return (<ApplicationContext.Provider value={{
    ...state,
    changeName, changeChampion,
    connectSocket, updateRooms, updateChampionPool,
    requestPlayerReady,
    requestKeyPress,
    requestDirectionChange,
    requestSendMessage,
    requestChampionSelect
  }}>
    {children}
  </ApplicationContext.Provider>)
}