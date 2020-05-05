import { createFetchVisualization, createFetchIdVisualization } from '../visualizations'
import { Filters, FetchState, IdDictionary } from '../../types'
import { getFeatures } from '../../data/Builder'

export const FETCH_FEATURES = 'FETCH_FEATURES'

export function fetchFeatures(filters: Filters) {
    const ids = Object.keys(filters.builder.featureFilters).filter(key => filters.builder.featureFilters[key].active)
    return createFetchIdVisualization(
        ids,
        FETCH_FEATURES,
        (id: string) => getFeatures(id, filters),
        filters,
    )
}