import { combineReducers } from 'redux'
import navigation from './navigation'
import detail from './detail'
import user from './user'

const rootReducer = combineReducers({
    navigation,
    detail,
    user
})

export default rootReducer
