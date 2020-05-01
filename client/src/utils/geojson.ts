import { GeojsonFeatureCollection } from "../store/types"

export function boundsToSquareFeature(bounds: [[number, number], [number, number]][]) {
    const globalBounds = bounds.reduce((result, bound) => {
        if (result.x_min === null || bound[0][0] < result.x_min) result.x_min = bound[0][0]

        if (result.x_max === null || bound[1][0] > result.x_max) result.x_max = bound[1][0]

        if (result.y_min === null || bound[0][1] < result.y_min) result.y_min = bound[0][1]

        if (result.y_max === null || bound[1][1] > result.y_max) result.y_max = bound[1][1]

        return result
    }, { x_min: null, y_min: null, x_max: null, y_max: null })

    const feature: GeojsonFeatureCollection = {
        type: "FeatureCollection",
        features: [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [globalBounds.x_min - 0.5, globalBounds.y_min - 0.5],
                            [globalBounds.x_min - 0.5, globalBounds.y_max + 0.5],
                            [globalBounds.x_max + 0.5, globalBounds.y_max + 0.5],
                            [globalBounds.x_max + 0.5, globalBounds.y_min - 0.5],
                            [globalBounds.x_min - 0.5, globalBounds.y_min - 0.5]
                        ]
                    ]
                }
            }
        ]
    }

    return feature
}