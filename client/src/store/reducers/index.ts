import { combineReducers } from 'redux'

import { filters } from './filters'

import {
} from './visualizations'

import {
    features,
} from './Builder/visualizations'


export default combineReducers({
    filters,
    features,
})