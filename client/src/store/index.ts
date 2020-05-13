import React from 'react'
import { Champion, Vector, ApplicationContextProviderState } from './types';



interface IApplicationContext extends ApplicationContextProviderState {
    changeName: (name: string) => void,
    changeChampion: (champion: string) => void,
    connectSocket: (roomId: string) => void,
    updateRooms: () => void
    updateChampionPool: () => void

    requestPlayerReady: (ready: boolean) => void
    requestDirectionChange: (direction: Vector) => void
    requestKeyPress: (code: string) => void
    requestSendMessage: (payload: { message: string }) => void
    requestChampionSelect: (champion: string) => void
}

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
        players: {},
        champions: [],
        victory: null,
        effects: [],
        changeName: (name: string) => { },
        changeChampion: (champion: string) => { },
        connectSocket: (roomId: string) => { },
        updateRooms: () => { },
        updateChampionPool: () => { },
        requestPlayerReady: (ready: boolean) => { },
        requestDirectionChange: (direction: Vector) => { },
        requestKeyPress: (code: string) => { },
        requestSendMessage: (payload: { message: string }) => { },
        requestChampionSelect: (champion: string) => { }
    })

export const ApplicationContextConsumer = ApplicationContext.Consumer
export { ApplicationContextProvider } from './provider'