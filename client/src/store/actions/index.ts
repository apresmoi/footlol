import { FilterSetter } from '../types'
import './visualizations'

export const SET_MULTIPLE_FILTERS = 'SET_MULTIPLE_FILTERS'

export function setMultipleFilters(filters: FilterSetter[]): FilterSetter {
    return { type: SET_MULTIPLE_FILTERS, value: filters }
}