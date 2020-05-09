export const routes = [
    { name: "Builder", route: '/' },
]

const prefix = "http://localhost:8080";

export const api = {
    features: prefix + "/features",
    featuresMeta: prefix + "/features/meta"
}


export const mapSize = {
    width: 2050, height: 950,
    field: { x: (2050 - 1900) / 2, y: (950 - 830) / 2, width: 1900, height: 830 },
    center: { x: 2050 / 2, y: 950 / 2, r: 140 },
    goal: { width: 60, height: 950 / 3 }
}


export const pallete = {
    'light': '#4C6B8F',
    'dark': '#2B3C4F',
    'darker': '#0B151E',
    'lighter': '#7D9EC7'
}
