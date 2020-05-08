export const routes = [
    { name: "Builder", route: '/' },
]

const prefix = "http://localhost:8080";

export const api = {
    features: prefix + "/features",
    featuresMeta: prefix + "/features/meta"
}

export const mapSize = { width: 1900, height: 830 }