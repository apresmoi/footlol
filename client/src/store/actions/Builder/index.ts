import { FilterSetter, Color, APIFeatureFilter, IdFilterSetter } from '../../types'

export const BUILDER_SET_BACKGROUND = 'BUILDER_SET_BACKGROUND'
export function BuilderSetBackground(
    value: Color,
): FilterSetter {
    return { type: BUILDER_SET_BACKGROUND, value }
}


export const BUILDER_ADD_FEATURE_SET = 'BUILDER_ADD_FEATURE_SET'
export function BuilderAddFeatureFilter(
    value: APIFeatureFilter
): FilterSetter {
    return { type: BUILDER_ADD_FEATURE_SET, value }
}

export const BUILDER_UPDATE_FEATURE_SET = 'BUILDER_UPDATE_FEATURE_SET'
export function BuilderUpdateFeatureFilter(
    id: string,
    value: APIFeatureFilter
): IdFilterSetter {
    return { type: BUILDER_UPDATE_FEATURE_SET, id, value }
}

export const BUILDER_DELETE_FEATURE_SET = 'BUILDER_DELETE_FEATURE_SET'
export function BuilderDeleteFeatureFilter(
    id: string,
): IdFilterSetter {
    return { type: BUILDER_DELETE_FEATURE_SET, id }
}