import { FetchState, FetchDispatcher, IdFetchDispatcher, IdFetchState } from '../types'

const initialFetchState: FetchState<any> = {
    data: null,
    filters: null,
    isFetching: false,
    fetchFilters: null,
    stale: false,
}

export function createFetchReducer<T>(fetchActionType: string) {
    return function (state: FetchState<T> = initialFetchState, action: FetchDispatcher<T>): FetchState<T> {
        switch (action.type) {
            case fetchActionType:
                switch (action.status) {
                    case 'fetch':
                        return {
                            ...state,
                            isFetching: true,
                            fetchFilters: action.filters,
                        }
                    case 'success':
                        return {
                            ...state,
                            data: action.data,
                            isFetching: false,
                            fetchFilters: null,
                            stale: false,
                            filters: action.filters,
                        }
                    default:
                        //error
                        return {
                            ...state,
                            isFetching: false,
                            stale: true,
                        }
                }
            default:
                return state
        }
    }
}

const initialIdFetchState: IdFetchState<any> = {
    data: {},
    filters: null,
    isFetching: false,
    fetchFilters: null,
    stale: false,
}

export function createIdFetchReducer<T>(fetchActionType: string) {
    return function (state: IdFetchState<T> = initialIdFetchState, action: IdFetchDispatcher<T>): IdFetchState<T> {
        switch (action.type) {
            case fetchActionType:
                switch (action.status) {
                    case 'fetch':
                        return {
                            ...state,
                            isFetching: true,
                            fetchFilters: action.filters,
                        }
                    case 'update':
                        return {
                            ...state,
                            data: {
                                ...state.data,
                                [action.id]: action.data
                            },
                            isFetching: true,
                            fetchFilters: action.filters,
                        }
                    default:
                        //error
                        return {
                            ...state,
                            isFetching: false,
                            stale: true,
                        }
                }
            default:
                return state
        }
    }
}