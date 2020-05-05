import { createIdFetchReducer } from "../visualizations"
import { FETCH_FEATURES } from "../../actions/Builder/visualizations"
import { IdDictionary } from "../../types"

export const features = createIdFetchReducer<IdDictionary<any>>(FETCH_FEATURES)