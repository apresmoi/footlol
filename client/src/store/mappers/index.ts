import { Filters, ReduxState } from '../types'

export const mapState = <T>(map: (state: ReduxState) => ReduxState | T) => {
    return (state: ReduxState) => map(state)
}