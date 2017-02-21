import { createStore, applyMiddleware, compose} from 'redux'
import rootReducer from '../reducers'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

const loggerMiddleware = createLogger({
    predicate: (getState, action) => __DEV__
});

export default function configureStore(initialState) {

    const enhancer = compose(
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware,
        ),
    );

    const store = createStore(rootReducer, initialState, enhancer)

    if (module.hot) {
        module.hot.accept(() => {
            const nextReducer = require('../reducers/index').default
            store.replaceReducer(nextReducer)
        })
    }

    return store
}
