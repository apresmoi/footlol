import { Filters, FetchDispatcher, IdFetchDispatcher } from '../types'

export function createFetchVisualization<T>(
    type: string,
    getData: Function,
    filters: Filters,
    dispatchCallback: (dispatch: (payload: FetchDispatcher<T>) => void, fetchDispatcher: FetchDispatcher<T>) => void = null,
) {
    return async (dispatch: (payload: FetchDispatcher<T>) => void) => {
        dispatch({ type, status: 'fetch', filters: { ...filters } })
        if (dispatchCallback)
            dispatchCallback(dispatch, {
                type,
                status: 'fetch',
                filters: { ...filters },
            })
        try {
            const data = await getData()
            dispatch({ type, status: 'success', data, filters: { ...filters } })
            if (dispatchCallback)
                dispatchCallback(dispatch, {
                    type,
                    status: 'success',
                    data,
                    filters: { ...filters },
                })
        } catch (error) {
            dispatch({ type, status: 'error', error, filters: { ...filters } })
            if (dispatchCallback)
                dispatchCallback(dispatch, {
                    type,
                    status: 'error',
                    error,
                    filters: { ...filters },
                })
        }
    }
}

export function createFetchIdVisualization<T>(
    ids: string[],
    type: string,
    getData: (id: string) => Promise<T>,
    filters: Filters,
    dispatchCallback: (dispatch: (payload: IdFetchDispatcher<T>) => void, fetchDispatcher: IdFetchDispatcher<T>) => void = null,
) {
    return async (dispatch: (payload: IdFetchDispatcher<T>) => void) => {
        ids.forEach(async id => {
            dispatch({ id, type, status: 'fetch', filters: { ...filters } })
            if (dispatchCallback)
                dispatchCallback(dispatch, {
                    id,
                    type,
                    status: 'fetch',
                    filters: { ...filters },
                })
            try {
                const data = await getData(id)
                dispatch({ id, type, status: 'update', data, filters: { ...filters } })
                if (dispatchCallback)
                    dispatchCallback(dispatch, {
                        id,
                        type,
                        status: 'update',
                        data,
                        filters: { ...filters },
                    })
            } catch (error) {
                dispatch({ id, type, status: 'error', error, filters: { ...filters } })
                if (dispatchCallback)
                    dispatchCallback(dispatch, {
                        id,
                        type,
                        status: 'error',
                        error,
                        filters: { ...filters },
                    })
            }
        })
    }
}


