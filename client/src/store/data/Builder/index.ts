import { api } from '../../../settings'
import { Filters, FetchState, IdDictionary, GeojsonFeatureCollection, APIFeatureFilter } from '../../types'
import { getData } from '../get'
import isEqual from 'lodash.isequal'

export async function getFeatures(
    id: string,
    filters: Filters,
): Promise<IdDictionary<GeojsonFeatureCollection>> {
    return await new Promise((resolve, reject) => {
        const featureFilter = filters.builder.featureFilters[id]

        const qs = {}

        const operatorToSymbol = (operator: 'in' | 'contains' | 'equal' | 'not_in') => {
            switch (operator) {
                case 'equal':
                    return ""
                default:
                    return `[${operator}]`
            }
        }

        qs[`level`] = featureFilter.level
        if (featureFilter.simplify) qs[`simplify`] = featureFilter.simplify
        if (featureFilter.key && featureFilter.key.value) qs[`key${operatorToSymbol(featureFilter.key.operator)}`] = featureFilter.key.value
        if (featureFilter.name && featureFilter.name.value) qs[`name${operatorToSymbol(featureFilter.name.operator)}`] = featureFilter.name.value

        getData(api.features, qs).then(data => {
            resolve(data)
        })
    })
}
