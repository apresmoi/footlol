export const elapsedSeconds = (from: Date, to: Date = null) => {
    if (!to) return (new Date().getTime() - from.getTime()) / 1000
    return (to.getTime() - from.getTime()) / 1000
}