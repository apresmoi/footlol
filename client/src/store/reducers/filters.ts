import { SET_MULTIPLE_FILTERS } from '../actions'
import { builderFilters, handleBuilderSetter } from './Builder/filters'
import * as baseActions from '../actions'
import * as builderActions from '../actions/Builder'

import { Filters } from '../types'

export const defaultState: Filters = {
    builder: {
        ...builderFilters,
    },
}

const baseSetters = Object.keys(baseActions).filter((action: string) =>
    action.includes('SET_') && action !== 'SET_MULTIPLE_FILTERS',
)
const builderSetters = Object.keys(builderActions).filter((action: string) =>
    typeof(action) === 'string'
)

function applyFilters(state: Filters, { type, id, value }) {
    if (baseSetters.includes(type))
        return handleBaseSetter(state, { type, value })
    if (builderSetters.includes(type))
        return handleBuilderSetter(state, { type, id, value })
    return state
}


export function handleBaseSetter(state = defaultState, { type, value }) {
    switch (type) {
        default:
            return state
    }
}

export function filters(state = defaultState, { type, id, value }) {
    switch (type) {
        case SET_MULTIPLE_FILTERS:
            value.forEach(v => {
                state = applyFilters(state, v)
            })
            return state
        default:
            return applyFilters(state, { type, id, value })
    }
}