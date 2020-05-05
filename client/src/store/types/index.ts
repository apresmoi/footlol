import { GeoPermissibleObjects, ExtendedFeature } from 'd3'

//views
export type IdDictionary<T> = { [id: string]: T }
export type ViewFeaturesType = IdFetchState<any>

export interface BuilderFilters {
  background: Color
  featureFilters: { [id: string]: APIFeatureFilter }
}

export interface Filters {
  builder: BuilderFilters
}

export interface ReduxState {
  filters: Filters
  features?: ViewFeaturesType
}
//redux general

export interface FilterSetter {
  type: string
  value: any
}

export interface IdFilterSetter {
  type: string
  id: string
  value?: any
}

export interface FetchState<T> {
  data?: T | IdDictionary<T>
  filters: Filters
  isFetching: boolean
  fetchFilters?: Filters
  stale: boolean
}

export interface IdFetchState<T> extends FetchState<T> {
  data: IdDictionary<T>
}

export interface FetchDispatcher<T> {
  type: string
  status: 'fetch' | 'success' | 'error' | 'update'
  filters: Filters
  data?: T
  error?: any
}

export interface IdFetchDispatcher<T> extends FetchDispatcher<T> {
  status: 'fetch' | 'error' | 'update'
  id: string
}

export interface ReduxViewProps extends ReduxState {
  dispatch: Function
}
export interface ViewProps {
  dispatch?: Function
}


//misc

export interface Color {
  r: number
  g: number
  b: number
  a: number
}

//api query

export interface APITextFilter {
  operator: 'contains' | 'equal'
  value: string
}

export interface APIArrayFilter {
  operator: 'in' | 'not_in'
  value: string[]
}

export interface APIRangeFilter {
  from: number
  to: number
}

export interface APIFeatureFilter {
  active: boolean
  level: number
  key?: APITextFilter
  name?: APITextFilter
  lat?: APIRangeFilter
  lng?: APIRangeFilter
  simplify?: number
  color?: Color
}

//geojson

export interface GeojsonFeatureProperties {
  id?: string
  name?: string
  lat?: number
  lng?: number
  bounds?: [[number, number], [number, number]]
  fill?: string
  stroke?: string
}

export interface GeojsonFeature extends ExtendedFeature<any, GeojsonFeatureProperties> {
}