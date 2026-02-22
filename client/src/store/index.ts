import React from 'react'
import { Vector, IApplicationContext } from './types';

export const ApplicationContext = React.createContext<IApplicationContext>(
    {
        name: "",
        champion: null,
        roomId: null,
        rooms: [],
        stage: null,
        self: null,
        ball: null,
        score: null,
        time: null,
        countdown: null,
        wallsUp: false,
        players: {},
        champions: [],
        victory: null,
        matchResults: null,
        config: null,
        effects: [],
        debug: [],
        messages: [],
        changeName: (name: string) => { },
        changeChampion: (champion: string) => { },
        connectSocket: (roomId: string) => { },
        updateRooms: () => { },
        createRoom: (name: string) => { },
        updateChampionPool: () => { },
        requestPlayerReady: (ready: boolean) => { },
        requestDirectionChange: (direction: Vector) => { },
        requestKeyPress: (code: string) => { },
        requestSendMessage: (payload: { message: string }) => { },
        requestChampionSelect: (champion: string) => { },
        requestKickPlayer: (id: string) => { },
        requestChangeSide: (side: string) => { },
        requestTransferAdmin: (id: string) => { },
        requestReturnToLobby: () => { },
        requestConfigChange: () => { },
        disconnectSocket: () => { }
    })

export const ApplicationContextConsumer = ApplicationContext.Consumer
export { ApplicationContextProvider } from './provider'