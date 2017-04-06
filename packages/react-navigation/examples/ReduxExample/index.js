/**
 * @flow
 */

import React from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';

import AppReducer from 'src/reducers';
import AppWithNavigationState from 'src/navigators/AppNavigator';

class ReduxExampleApp extends React.Component {
  store = createStore(AppReducer, undefined, autoRehydrate());

  componentDidMount() {
    persistStore(this.store, { storage: AsyncStorage });
  }

  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('ReduxExample', () => ReduxExampleApp);
