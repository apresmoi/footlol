import { createIdFetchReducer } from "../visualizations"
import { FETCH_FEATURES } from "../../actions/Builder/visualizations"
import { GeojsonFeatureCollection, IdDictionary } from "../../types"

export const features = createIdFetchReducer<IdDictionary<GeojsonFeatureCollection>>(FETCH_FEATURES)