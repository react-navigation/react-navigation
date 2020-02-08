import * as React from 'react';
import {
  CommonActions,
  getPathFromState,
  getStateFromPath,
  NavigationState,
} from '@react-navigation/core';
import {
  getActionTypeFromPath,
  current,
  matchPathAndParams,
  getStateActionType,
  setPathToHistory,
} from './utils';
import { parseUrl, parse } from 'query-string';

/**
 * This Hooks is for add a listener for browser back/forward button.
 *
 * If user click on browser `back` button, the navigation goBack function have been running.
 *
 * If User click on browser `forward` button, the navigation navigate function have been running.
 * @param {object} param
 * @param {object} param.navigationRef
 */
export const useBrowserBackAndForwardListener = ({
  navigationRef,
}: {
  navigationRef: any;
}): void => {
  React.useEffect(() => {
    const navigateToHistory = () => {
      const { current: navigation } = navigationRef;

      const actionType = getActionTypeFromPath(
        current.path,
        window.location.pathname
      );

      if (actionType === 'POP') {
        current.browserBackButtonEmitted = true;
        navigation.goBack();
      } else {
        current.browserBackButtonEmitted = true;
        const path = window.location.pathname.split('/').pop();
        const [routeName, search] = path ? path.split('?') : [];

        navigation.dispatch(
          CommonActions.navigate({
            name: routeName,
            params: parse(search),
          })
        );
      }
      return true;
    };

    window.addEventListener('popstate', navigateToHistory);
    return () => window.removeEventListener('popstate', navigateToHistory);
  });
};

/**
 * This function should be run when the navigation state change
 * @param {object} param0
 * @param {object} param0.state Navigation state
 */
export const syncStateWithHistory = (state: NavigationState): void => {
  const { routes } = state;
  const pathAndParams = getPathFromState(state);
  if (pathAndParams && !matchPathAndParams(pathAndParams, current.path)) {
    if (!current.browserBackButtonEmitted) {
      const stateActionType = getStateActionType(
        current.routes.length,
        routes.length
      );

      setPathToHistory(stateActionType, pathAndParams);
    }
  }

  current.browserBackButtonEmitted = false;
  current.path = window.location.pathname;
  current.routes = [...routes];
};

/**
 * if user have been navigate to a sub page from another site or insert manual url
 * like `www.site.com/dashboard/mail` This function give a state to open that page directly
 */
export const getInitialStateFromLocation = (): any => {
  const initialState = getStateFromPath(window.location.pathname);

  function getChildRoutes(route: any): any[] {
    if (route?.state?.routes?.[0]) {
      return [route, ...getChildRoutes(route.state.routes[0])];
    }
    return [route];
  }

  if (!initialState?.routes) {
    return initialState;
  }

  const route = getChildRoutes(initialState.routes[0]);
  initialState.routes = initialState.routes.concat(route);
  initialState.routes[initialState.routes.length - 1].params = parseUrl(
    window.location.pathname
  ).query;

  return initialState;
};
