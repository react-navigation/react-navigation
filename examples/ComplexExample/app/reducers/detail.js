import * as ActionTypes from '../constants/ActionTypes'

// Will eventually contain all detail items
const initialState = []

export default function(state = initialState, action) {

    switch(action.type) {

        // Push detail items
        case ActionTypes.SET_DETAIL_STATE:
            return action.data

        default:
            return state
    }
}
