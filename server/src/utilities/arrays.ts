export const reverseArray = <T>(arr: Array<T>): Array<T> => {
    return arr.reduce((result, e, i) => {
        result[arr.length - i - 1] = e
        return result
    }, [])
}