import {
    BUILDER_SET_BACKGROUND,
    BUILDER_ADD_FEATURE_SET,
    BUILDER_UPDATE_FEATURE_SET,
    BUILDER_DELETE_FEATURE_SET
} from '../../actions/Builder'
import { defaultState } from '../filters'
import { BuilderFilters } from '../../types'

export const builderFilters: BuilderFilters = {
    background: { r: 170, g: 218, b: 255, a: 0.6 },
    featureFilters: {
        '12314iowrg': {
            active: true,
            key: { operator: 'equal', value: 'ARG' },
            level: 0,
            simplify: 5,
            color: null,
        },
        '12314sssg': {
            active: true,
            key: { operator: 'equal', value: 'VEN' },
            level: 0,
            color: null,
        }
    }
}

const characters = ["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"]
const usedID = []
const GetUniqueID = (): string => {
    let uniqueID = ""
    while (usedID.includes(uniqueID))
        uniqueID = new Array(10).fill(0).map(x => characters[Math.round(Math.random() * characters.length)]).join('')
    usedID.push(uniqueID)
    return uniqueID
}

export function handleBuilderSetter(state = defaultState, { type, id, value }) {
    switch (type) {
        case BUILDER_SET_BACKGROUND:
            return {
                ...state,
                builder: {
                    ...state.builder,
                    background: value
                },
            }
        case BUILDER_ADD_FEATURE_SET:
            return {
                ...state,
                builder: {
                    ...state.builder,
                    featureFilters: {
                        ...state.builder.featureFilters,
                        [GetUniqueID()]: value
                    }
                }
            }
        case BUILDER_UPDATE_FEATURE_SET:
            return {
                ...state,
                builder: {
                    ...state.builder,
                    featureFilters: {
                        ...state.builder.featureFilters,
                        [id]: value,
                    }
                }
            }
        case BUILDER_DELETE_FEATURE_SET:
            return {
                ...state,
                builder: {
                    ...state.builder,
                    featureFilters: {
                        ...state.builder.featureFilters,
                        [id]: undefined
                    }
                }
            }
        default:
            return state
    }
}