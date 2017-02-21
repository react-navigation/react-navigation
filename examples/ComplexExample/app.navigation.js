import React from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'

import configureStore from './app/store/configureStore'
const store = configureStore()

import RootContainer from './app/containers/rootContainer'

const App = () => (
    <Provider store={store}>
        <RootContainer />
    </Provider>
)

AppRegistry.registerComponent('RNExperimental', () => App)
