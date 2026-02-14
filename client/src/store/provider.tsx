import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ApplicationContext } from '.'
import { mapSize } from '../settings';
import RoomSocket from './socket'
import { Vector, RoomStage, ApplicationContextProviderState, Player } from './types';

const MAX_NAME_LENGTH = 12
const sanitizeName = (value: string) => value.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LENGTH)

const localStorageData: {
  name: string
} = (() => {
  const value = localStorage.getItem('game');
  if (!value) return { name: "" };

  try {
    const parsed = JSON.parse(value);
    return { name: sanitizeName(parsed?.name || "") };
  } catch (error) {
    return { name: "" };
  }
})();

const resetState = {
  champion: null,
  roomId: null,
  rooms: [],
  champions: [],
  stage: null,
  self: null,
  ball: null,
  score: null,
  time: null,
  countdown: null,
  victory: null,
  players: {},
  effects: [],
  debug: [],
  messages: [],
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
  const navigate = useNavigate()
  const location = useLocation()
  const socketRef = useRef<RoomSocket>(null)

  const name: string = localStorageData?.name ? localStorageData.name : ""
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

  const disconnectSocket = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.disconnect()
    socketRef.current = null
    setState((prev) => {
      if (prev.roomId === null) return prev
      return { ...prev, roomId: null }
    })
  }, [])

  const handleSocketReset = useCallback((activeSocket: RoomSocket) => {
    if (socketRef.current !== activeSocket) return
    activeSocket.disconnect()
    socketRef.current = null
  }, [])

  const bindSocketSubscribers = useCallback((activeSocket: RoomSocket) => {
    activeSocket.subscribeLoginSuccess((payload) => {
      setState((prev) => ({
        ...prev,
        ...payload,
      }))
    })
    activeSocket.subscribePlayerJoin((player) => {
      setState((prev) => ({
        ...prev,
        players: { ...prev.players, [player.id]: player },
        messages: [...prev.messages, {
          name: "GameServer",
          message: `Player ${player.name} has joined.`
        }]
      }))
    })
    activeSocket.subscribePositionChange((player) => {
      setState((prev) => ({
        ...prev,
        players: { ...prev.players, [player.id]: player }
      }))
    })
    activeSocket.subscribePlayerLeave((player) => {
      setState((prev) => {
        const leavingPlayer = prev.players[player.id]
        const nextPlayers = { ...prev.players }
        delete nextPlayers[player.id]

        return {
          ...prev,
          players: nextPlayers,
          messages: leavingPlayer
            ? [...prev.messages, {
              name: "GameServer",
              message: `Player ${leavingPlayer.name} left.`
            }]
            : prev.messages
        }
      })
    })

    activeSocket.subscribePlayerKicked(() => {
      navigate("/room-select")
    })

    activeSocket.subscribeUpdate((payload) => {
      setState((prev) => {
        if (payload.stage === 'TEAM_SELECT' && !prev.self) {
          handleSocketReset(activeSocket)
          return { ...prev, ...resetState }
        }

        const nextSelf = prev.self && payload.players[prev.self.id]
          ? { ...payload.players[prev.self.id] }
          : prev.self

        return {
          ...prev,
          ...payload,
          self: nextSelf
        }
      })
    })

    activeSocket.subscribeMessageSent((payload) => {
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, payload]
      }))
    })

    activeSocket.subscribeStageChange((payload) => {
      setState((prev) => {
        if (payload.stage === 'TEAM_SELECT' && !prev.self) {
          handleSocketReset(activeSocket)
          return { ...prev, ...resetState }
        }

        return {
          ...prev,
          stage: payload.stage
        }
      })
    })
  }, [handleSocketReset, navigate])

  const changeName = useCallback((nextName: string) => {
    const safeName = sanitizeName(nextName)
    localStorage.setItem('game', JSON.stringify({ name: safeName }))
    setState((prev) => ({ ...prev, name: safeName }))
  }, [])

  const changeChampion = useCallback((nextChampion: string) => {
    setState((prev) => ({ ...prev, champion: nextChampion }))
  }, [])

  const connectSocket = useCallback((roomId: string) => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    const activeSocket = new RoomSocket(roomId, sanitizeName(state.name));
    socketRef.current = activeSocket
    bindSocketSubscribers(activeSocket)

    setState((prev) => ({ ...prev, roomId }))
    activeSocket.connect()
  }, [bindSocketSubscribers, state.name])

  useEffect(() => {
    if (location.pathname.includes('/room-select')) {
      disconnectSocket()
      return
    }

    if (location.pathname === "/game" && !socketRef.current) {
      navigate("/room-select", { replace: true })
    }
  }, [disconnectSocket, location.pathname, navigate])

  useEffect(() => () => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }, [])

  const updateChampionPool = useCallback(() => {
    fetch('/api/champions')
      .then(response => response.json())
      .then(champions => {
        setState((prev) => ({ ...prev, champions }))
      }).catch(err => { console.log(err) })
  }, [])

  useEffect(() => {
    updateChampionPool();
  }, [updateChampionPool])

  const requestPlayerReady = useCallback((ready: boolean) => {
    socketRef.current?.requestPlayerReady(ready)
  }, [])

  const requestKeyPress = useCallback((code: string) => {
    socketRef.current?.requestKeyPress(code)
  }, [])

  const requestDirectionChange = useCallback((direction: Vector) => {
    socketRef.current?.requestDirectionChange(direction)
  }, [])

  const requestSendMessage = useCallback((payload: { message: string }) => {
    socketRef.current?.requestSendMessage(payload)
  }, [])

  const requestChampionSelect = useCallback((nextChampion: string) => {
    socketRef.current?.requestChampionSelect(nextChampion)
  }, [])

  const requestKickPlayer = useCallback((id: string) => {
    socketRef.current?.requestKickPlayer(id)
  }, [])

  const requestChangeSide = useCallback((side: string) => {
    socketRef.current?.requestChangeSide(side)
  }, [])

  const updateRooms = useCallback(() => {
    fetch('/api/rooms')
      .then(response => response.json())
      .then(rooms => {
        setState((prev) => ({ ...prev, rooms }))
      }).catch(err => { console.log(err) })
  }, [])

  const createRoom = useCallback((roomName: string) => {
    fetch('/api/rooms',
      {
        method: 'POST',
        body: JSON.stringify({ name: roomName }),
        headers: {
          'content-type': 'application/json'
        }
      }
    )
      .then(response => response.json())
      .then(room => {
        if (room.id) {
          connectSocket(room.id)
          navigate("/game")
        }
      }).catch(err => { console.log(err) })
  }, [connectSocket, navigate])


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
