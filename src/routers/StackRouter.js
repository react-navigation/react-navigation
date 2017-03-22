/* @flow */

import pathToRegexp from 'path-to-regexp';

import NavigationActions from '../NavigationActions';
import createConfigGetter from './createConfigGetter';
import getScreenForRouteName from './getScreenForRouteName';
import StateUtils from '../StateUtils';
import validateRouteConfigMap from './validateRouteConfigMap';

import type {
  NavigationRoute,
  NavigationAction,
  NavigationComponent,
  NavigationNavigateAction,
  NavigationRouter,
  NavigationRouteConfigMap,
  NavigationResetAction,
  NavigationParams,
  NavigationState,
  NavigationStackAction,
  NavigationStackRouterConfig,
} from '../TypeDefinition';

const uniqueBaseId = `id-${Date.now()}`;
let uuidCount = 0;
function _getUuid() {
  return `${uniqueBaseId}-${uuidCount++}`;
}

export default (
  routeConfigs: NavigationRouteConfigMap,
  stackConfig: NavigationStackRouterConfig = {},
): NavigationRouter => {
  // Fail fast on invalid route definitions
  validateRouteConfigMap(routeConfigs);

  const childRouters = {};
  const routeNames = Object.keys(routeConfigs);

  routeNames.forEach((routeName: string) => {
    const screen = getScreenForRouteName(routeConfigs, routeName);
    if (screen && screen.router) {
      // If it has a router it's a navigator.
      childRouters[routeName] = screen.router;
    } else {
      // If it doesn't have router it's an ordinary React component.
      childRouters[routeName] = null;
    }
  });

  const {
    initialRouteParams,
  } = stackConfig;

  const initialRouteName = stackConfig.initialRouteName || routeNames[0];

  const initialChildRouter = childRouters[initialRouteName];
  const paths = stackConfig.paths || {};

  routeNames.forEach((routeName: string) => {
    let pathPattern = paths[routeName] || routeConfigs[routeName].path;
    const matchExact = !!pathPattern && !childRouters[routeName];
    if (!pathPattern) {
      pathPattern = routeName;
    }
    const keys = [];
    let re = pathToRegexp(pathPattern, keys);
    if (!matchExact) {
      const wildcardRe = pathToRegexp(`${pathPattern}/*`, keys);
      re = new RegExp(`(?:${re.source})|(?:${wildcardRe.source})`);
    }
      /* $FlowFixMe */
    paths[routeName] = { re, keys };
  });

  return {

    getComponentForState(state: NavigationState): NavigationComponent {
      const activeChildRoute = state.routes[state.index];
      const { routeName } = activeChildRoute;
      if (childRouters[routeName]) {
        return childRouters[routeName].getComponentForState(activeChildRoute);
      }
      return getScreenForRouteName(routeConfigs, routeName);
    },

    getComponentForRouteName(routeName: string): NavigationComponent {
      return getScreenForRouteName(routeConfigs, routeName);
    },

    getStateForAction(action: NavigationStackAction, state: ?NavigationState) {
      action = NavigationActions.mapDeprecatedActionAndWarn(action);

      // Set up the initial state if needed
      if (!state) {
        let route = {};
        if (action.type === NavigationActions.NAVIGATE && (childRouters[action.routeName] !== undefined)) {
          return {
            index: 0,
            routes: [
              {
                ...action,
                type: undefined,
                key: 'Init',
              },
            ],
          };
        }
        if (initialChildRouter) {
          route = initialChildRouter.getStateForAction(NavigationActions.navigate({
            routeName: initialRouteName,
            params: initialRouteParams,
          }));
        }
        const params = (route.params || action.params || initialRouteParams) && {
          ...(route.params || {}),
          ...(action.params || {}),
          ...(initialRouteParams || {}),
        };
        route = {
          ...route,
          routeName: initialRouteName,
          key: 'Init',
          ...(params ? { params } : {}),
        };
        state = {
          index: 0,
          routes: [route],
        };
      }

      // Check if the current scene wants to handle the action
      const currentRoute = state.routes[state.index];
      const childRouter = childRouters[currentRoute.routeName];
      if (childRouter) {
        const route = childRouter.getStateForAction(action, currentRoute);
        if (route && route !== currentRoute) {
          return StateUtils.replaceAt(state, currentRoute.key, route);
        }
      }

      // Handle push/pop
      if (action.type === NavigationActions.NAVIGATE && childRouters[action.routeName] !== undefined) {
        const childRouter = childRouters[action.routeName];
        let route;
        if (childRouter) {
          const childAction = action.action || NavigationActions.init({ params: action.params });
          route = {
            ...action,
            ...childRouter.getStateForAction(childAction),
            key: _getUuid(),
            routeName: action.routeName,
          };
        } else {
          route = {
            ...action,
            key: _getUuid(),
            routeName: action.routeName,
          };
        }
        return StateUtils.push(state, route);
      }

      if (action.type === NavigationActions.SET_PARAMS) {
        /* $FlowFixMe */
        const lastRoute = state.routes.find((route: *) => route.key === action.key);
        if (lastRoute) {
          const params = {
            ...lastRoute.params,
            ...action.params,
          };
          const routes = [...state.routes];
          routes[state.routes.indexOf(lastRoute)] = {
            ...lastRoute,
            params,
          };
          return {
            ...state,
            routes,
          };
        }
      }

      if (action.type === NavigationActions.RESET) {
        const resetAction = ((action: any): NavigationResetAction);

        return {
          ...state,
          routes: resetAction.actions.map((action: NavigationNavigateAction, index: number) => {
            const router = childRouters[action.routeName];
            if (router) {
              return {
                ...action,
                ...router.getStateForAction(action),
                routeName: action.routeName,
                key: `Init${index}`,
              };
            }
            const route = {
              ...action,
              key: `Init${index}`,
            };
            delete route.type;
            return route;
          }),
          index: action.index,
        };
      }

      if (action.type === NavigationActions.BACK) {
        let backRouteIndex = null;
        if (action.key) {
          /* $FlowFixMe */
          const backRoute = state.routes.find((route: *) => route.key === action.key);
          /* $FlowFixMe */
          backRouteIndex = state.routes.indexOf(backRoute);
        }
        if (backRouteIndex == null) {
          return StateUtils.pop(state);
        }
        if (backRouteIndex > 0) {
          return {
            ...state,
            routes: state.routes.slice(0, backRouteIndex),
            index: backRouteIndex - 1,
          };
        }
      }
      return state;
    },

    getPathAndParamsForState(state: NavigationState): {path: string, params?: NavigationParams} {
      // TODO: implement this!
      return {
        path: '',
      };
    },

    getActionForPathAndParams(pathToResolve: string): ?NavigationAction {
      // If the path is empty (null or empty string)
      // just return the initial route action
      if (!pathToResolve) {
        return NavigationActions.navigate({
          routeName: initialRouteName,
        });
      }

      // Attempt to match `pathToResolve` with a route in this router's
      // routeConfigs
      let matchedRouteName;
      let pathMatch;
      let pathMatchKeys;

      for (const routeName in paths) {
        /* $FlowFixMe */
        const { re, keys } = paths[routeName];
        pathMatch = re.exec(pathToResolve);
        if (pathMatch && pathMatch.length) {
          pathMatchKeys = keys;
          matchedRouteName = routeName;
          break;
        }
      }

      // We didn't match -- return null
      if (!matchedRouteName) {
        return null;
      }

      // Determine nested actions:
      // If our matched route for this router is a child router,
      // get the action for the path AFTER the matched path for this
      // router
      let nestedAction;
      if (childRouters[matchedRouteName]) {
        nestedAction = childRouters[matchedRouteName].getActionForPathAndParams(
          /* $FlowFixMe */
          pathMatch.slice(pathMatchKeys.length).join('/')
        );
      }

      // reduce the matched pieces of the path into the params
      // of the route. `params` is null if there are no params.
      /* $FlowFixMe */
      const params = pathMatch.slice(1).reduce((result: *, matchResult: *, i: number) => {
        const key = pathMatchKeys[i];
        if (key.asterisk || !key) {
          return result;
        }
        const nextResult = result || {};
        const paramName = key.name;
        nextResult[paramName] = matchResult;
        return nextResult;
      }, null);

      return NavigationActions.navigate({
        routeName: matchedRouteName,
        ...(params ? { params } : {}),
        ...(nestedAction ? { action: nestedAction } : {}),
      });
    },

    getScreenConfig: createConfigGetter(routeConfigs, stackConfig.navigationOptions),

  };
};
