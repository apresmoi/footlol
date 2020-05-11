export const routes = [
    { name: "Builder", route: '/' },
]

const prefix = "http://localhost:8080";

export const api = {
    features: prefix + "/features",
    featuresMeta: prefix + "/features/meta"
}


export const mapSize = {
    width: 2050, height: 1000,
    field: { x: (2050 - 1900) / 2, y: (1000 - 830) / 2, width: 1900, height: 830 },
    center: { x: 2050 / 2, y: 1000 / 2, r: 140 },
    goal: { width: 50, height: 1000 / 3 }
}


export const pallete = {
    'darkest': '#081017',
    'darker': '#172432',
    'dark': '#283C50',
    'medium': '#435870',
    'light': '#4C6F97',
    'lighter': '#8DAFD6'
}
