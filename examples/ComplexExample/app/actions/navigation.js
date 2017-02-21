import * as ActionTypes from '../constants/ActionTypes'

export function push(route) {
    return {
        type: ActionTypes.PUSH_ROUTE,
        route
    }
}

export function pop() {
    return {
        type: ActionTypes.POP_ROUTE
    }
}
