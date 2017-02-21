import * as ActionTypes from '../constants/ActionTypes'
import { user } from '../api/response'

// Fetch and set user
export function authenticate(opts) {
    return (dispatch, getState) => {
        setTimeout( () => {
            dispatch({
                type: ActionTypes.SET_USER,
                user
            })
        }, 500)
    }
}
