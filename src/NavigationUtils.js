const errorMessage = {
  IMPROPER_NAVIGATION_STATE: 'Improper navigation state set as reference to Navigation Utility.',
  UNDEFINED_PARAMETERS: 'Error in passing parameters.',
  NO_EXISTING_ROUTE: 'There is no route existing in the stack with the route name',
  NO_EXISTING_NEXT_ROUTE: 'There is no route existing in the stack next to the route with the route name',
  IMPROPER_ACTION: 'Actions must be plain objects',
};

let Navigator = null;
let debug = false;
let keysList = [];

const validate = (value, errMsg) => {
  if (!value && debug) {
    throw new Error(errMsg);
  }
};

const setNavigatorReference = (Nav, debugFlag = false) => {
  Navigator = Nav;
  debug = debugFlag;
};

const searchForNextInState = (navigationState, routeName) => {
  validate(navigationState, errorMessage.IMPROPER_NAVIGATION_STATE);
  if (navigationState && navigationState.routeName === routeName) {
    return true;
  }
  if (navigationState && navigationState.routes) {
    const { length } = navigationState.routes;
    for (let i = 0; i < length; i += 1) {
      const found = searchForNextInState(navigationState.routes[i], routeName);
      if ((i + 1) < length && found) {
        keysList.push(navigationState.routes[i + 1].key);
      } else if (found) {
        return true;
      }
    }
  }
  return false;
};

const getKeyForNextRoute = (routeName) => {
  validate(routeName, errorMessage.UNDEFINED_PARAMETERS);
  if (routeName) {
    keysList = [];
    searchForNextInState(Navigator.state.nav, routeName);
    if (keysList.length === 0) {
      if (debug) {
        throw new Error(`${errorMessage.NO_EXISTING_NEXT_ROUTE} ${routeName}.`);
      }
      return '';
    }
    return keysList[keysList.length - 1];
  }
  return '';
};

const searchInState = (navigationState, routeName) => {
  validate(navigationState, errorMessage.IMPROPER_NAVIGATION_STATE);
  if (navigationState && navigationState.routeName === routeName) {
    keysList.push(navigationState.key);
    return;
  }
  if (navigationState && navigationState.routes) {
    const { length } = navigationState.routes;
    for (let i = 0; i < length; i += 1) {
      searchInState(navigationState.routes[i], routeName);
    }
  }
};

const getKeyForRoute = (routeName) => {
  validate(routeName, errorMessage.UNDEFINED_PARAMETERS);
  if (routeName) {
    keysList = [];
    searchInState(Navigator.state.nav, routeName);
    if (keysList.length === 0) {
      if (debug) {
        throw new Error(`${errorMessage.NO_EXISTING_ROUTE} ${routeName}.`);
      }
      return '';
    }
    return keysList[keysList.length - 1];
  }
  return '';
};

const getCurrentRoute = (navigationState = Navigator.state.nav) => {
  validate(navigationState, errorMessage.IMPROPER_NAVIGATION_STATE);
  if (navigationState && navigationState.routes) {
    const currentIndex = navigationState.index;
    return getCurrentRoute(navigationState.routes[currentIndex]);
  }
  if (navigationState) {
    return navigationState.routeName;
  }
  return '';
};

const getCurrentRouteKey = (navigationState = Navigator.state.nav) => {
  validate(navigationState, errorMessage.IMPROPER_NAVIGATION_STATE);
  if (navigationState && navigationState.routes) {
    const currentIndex = navigationState.index;
    return getCurrentRouteKey(navigationState.routes[currentIndex]);
  }
  if (navigationState) {
    return navigationState.key;
  }
  return '';
};

const dispatch = (action) => {
  if (typeof action === 'object') {
    Navigator.dispatch(action);
  } else if (debug) {
    throw new Error(errorMessage.IMPROPER_ACTION);
  }
};

const getState = () => Navigator.state.nav;

export default {
  setNavigatorReference,
  getKeyForNextRoute,
  getKeyForRoute,
  getCurrentRoute,
  getCurrentRouteKey,
  dispatch,
  getState,
};
