
import React from 'react';

import { NavigationActions, addNavigationHelpers } from 'react-navigation';

function getAction(router, path, params) {
  const action = router.getActionForPathAndParams(path, params);
  if (action) {
    return action;
  }
  return NavigationActions.navigate({
    params: { path },
    routeName: 'NotFound',
  });
}

module.exports = (NavigationAwareView) => {
  const initialAction = getAction(NavigationAwareView.router, window.location.pathname.substr(1));
  const initialState = NavigationAwareView.router.getStateForAction(initialAction);
  console.log({initialAction, initialState});

  class NavigationContainer extends React.Component {
    state = initialState;
    componentDidMount() {
      document.title = NavigationAwareView.router.getScreenConfig({state: this.state.routes[this.state.index], dispatch: this.dispatch}, 'title');
      window.onpopstate = (e) => {
        e.preventDefault();
        const action = getAction(NavigationAwareView.router, window.location.pathname.substr(1));
        if (action) this.dispatch(action);
      };
    }
    componentWillUpdate(props, state) {
      const {path} = NavigationAwareView.router.getPathAndParamsForState(state);
      const uri = `/${path}`;
      if (window.location.pathname !== uri) {
        window.history.pushState({}, state.title, uri);
      }
      document.title = NavigationAwareView.router.getScreenConfig({state: state.routes[state.index], dispatch: this.dispatch}, 'title');
    }
    dispatch = (action) => {
      const state = NavigationAwareView.router.getStateForAction(action, this.state);

      if (!state) {
        console.log('Dispatched action did not change state: ', {action});
      } else if (console.group) {
        console.group('Navigation Dispatch: ');
        console.log('Action: ', action);
        console.log('New State: ', state);
        console.log('Last State: ', this.state);
        console.groupEnd();
      } else {
        console.log('Navigation Dispatch: ', {action, newState: state, lastState: this.state});
      }

      if (!state) {
        return true;
      }

      if (state !== this.state) {
        this.setState(state);
        return true;
      }
      return false;
    };
    render() {
      return <NavigationAwareView navigation={addNavigationHelpers({state: this.state, dispatch: this.dispatch})} />
    }
    getURIForAction = (action) => {
      const state = NavigationAwareView.router.getStateForAction(action, this.state) || this.state;
      const {path} = NavigationAwareView.router.getPathAndParamsForState(state);
      return `/${path}`;
    }
    getActionForPathAndParams = (path, params) => {
      return NavigationAwareView.router.getActionForPathAndParams(path, params);
    }
    static childContextTypes = {
      getActionForPathAndParams: React.PropTypes.func.isRequired,
      getURIForAction: React.PropTypes.func.isRequired,
      dispatch: React.PropTypes.func.isRequired,
    };
    getChildContext() {
      return {
        getActionForPathAndParams: this.getActionForPathAndParams,
        getURIForAction: this.getURIForAction,
        dispatch: this.dispatch,
      };
    }
  }
  return NavigationContainer;
};
