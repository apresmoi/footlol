import React, { useState } from 'react'
import RoomSocket from './socket';
import { RoomStage, Player, Ball, Score, Vector } from './types';

export type Champion = 'Lux' | 'Nami';
export type Room = {
    id: string
    name: string
    players: number
}

interface IApplicationContext {
    name: string
    champion?: Champion
    roomId?: string
    rooms: Room[]
    stage: RoomStage
    champions: Champion[]

    self?: Player
    ball?: Ball
    score?: Score
    time?: number
    players: { [x: string]: Player }

    changeName: (name: string) => void,
    changeChampion: (champion: Champion) => void,
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
        players: {},
        champions: [],
        changeName: (name: string) => { },
        changeChampion: (champion: Champion) => { },
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