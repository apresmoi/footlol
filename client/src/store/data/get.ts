import axios from 'axios'

const forceLocalCache = false

const endpointsCache: { [key: string]: any } = {}
const isCached = (key: string) => {
    return endpointsCache[key] ? true : false
}
const setCache = (key: string, data) => {
    endpointsCache[key] = data
}
const getCache = (key: string) => {
    return endpointsCache[key]
}

const getKey = (url: string, filters: any) => {
    return `${url}_${Object.keys(filters)
        .map(key => filters[key])
        .join('_')}`
}

const cacheFunction = async (url: string, filters: any, func: Function) => {
    const key = getKey(url, filters)
    if (!isCached(key)) setCache(key, func())
    return await getCache(key)
}

export function getData(
    url: string,
    filters: any,
    cache: boolean = forceLocalCache,
) {
    const req = () => axios.get(url, { params: filters }).then(response => response.data)
    if (cache) return cacheFunction(url, filters, req)
    return req()
}