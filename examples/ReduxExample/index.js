/**
 * @flow
 */

import React from 'react';
import { AppRegistry, BackHandler } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import AppReducer from './src/reducers';
import AppWithNavigationState from './src/navigators/AppNavigator';
import { NavigationActions } from 'react-navigation';

class ReduxExampleApp extends React.Component {
  store = createStore(AppReducer);

  componentDidMount() {
  	BackHandler.addEventListener(backEvent, ()=> {
		  const state = this.store.getState();
		  const navigationState = state.nav;   // the name of reducer
		  if(navigationState && navigationState.index) {
			  this.store.dispatch(NavigationActions.back())
			  return true;
		  }
		  return false;
	  });
  }

  componentWillUnmount() {
  	BackHandler.removeEventListener(backEvent);
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

export default ReduxExampleApp;
