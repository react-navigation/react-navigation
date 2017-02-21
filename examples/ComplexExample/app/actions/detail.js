import * as ActionTypes from '../constants/ActionTypes'
import { response } from '../api/response'

// Simulate API fetch with timeout
// Dispatch action with hardcoded example response
export function fetchDetailState(opts) {
    return (dispatch, getState) => {
        setTimeout( () => {
            dispatch({
                type: ActionTypes.SET_DETAIL_STATE,
                data: response
            })
        }, 500)
    }
}
