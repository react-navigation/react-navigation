/* @flow */

import pathToRegexp from 'path-to-regexp';

import NavigationActions from '../NavigationActions';
import createConfigGetter from './createConfigGetter';
import getScreenForRouteName from './getScreenForRouteName';
import StateUtils from '../StateUtils';
import validateRouteConfigMap from './validateRouteConfigMap';
import getScreenConfigDeprecated from './getScreenConfigDeprecated';

import type {
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
  stackConfig: NavigationStackRouterConfig = {}
): NavigationRouter<*, *, *> => {
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

  const { initialRouteParams } = stackConfig;

  const initialRouteName = stackConfig.initialRouteName || routeNames[0];

  const initialChildRouter = childRouters[initialRouteName];
  const paths = stackConfig.paths || {};

  routeNames.forEach((routeName: string) => {
    let pathPattern = paths[routeName] || routeConfigs[routeName].path;
    const matchExact = !!pathPattern && !childRouters[routeName];
    if (typeof pathPattern !== 'string') {
      pathPattern = routeName;
    }
    const keys = [];
    let re = pathToRegexp(pathPattern, keys);
    if (!matchExact) {
      const wildcardRe = pathToRegexp(`${pathPattern}/*`, keys);
      re = new RegExp(`(?:${re.source})|(?:${wildcardRe.source})`);
    }
    /* $FlowFixMe */
    paths[routeName] = { re, keys, toPath: pathToRegexp.compile(pathPattern) };
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

    getStateForAction(
      passedAction: NavigationStackAction,
      state: ?NavigationState
    ) {
      const action = NavigationActions.mapDeprecatedActionAndWarn(passedAction);

      // Set up the initial state if needed
      if (!state) {
        let route = {};
        if (
          action.type === NavigationActions.NAVIGATE &&
          childRouters[action.routeName] !== undefined
        ) {
          return {
            index: 0,
            routes: [
              {
                ...action,
                type: undefined,
                key: `Init-${_getUuid()}`,
              },
            ],
          };
        }
        if (initialChildRouter) {
          route = initialChildRouter.getStateForAction(
            NavigationActions.navigate({
              routeName: initialRouteName,
              params: initialRouteParams,
            })
          );
        }
        const params = (route.params ||
          action.params ||
          initialRouteParams) && {
          ...(route.params || {}),
          ...(action.params || {}),
          ...(initialRouteParams || {}),
        };
        route = {
          ...route,
          routeName: initialRouteName,
          key: `Init-${_getUuid()}`,
          ...(params ? { params } : {}),
        };
        // eslint-disable-next-line no-param-reassign
        state = {
          index: 0,
          routes: [route],
        };
      }

      // Check if a child scene wants to handle the action as long as it is not a reset to the root stack
      if (action.type !== NavigationActions.RESET || action.key !== null) {
        const keyIndex = action.key
          ? StateUtils.indexOf(state, action.key)
          : -1;
        const childIndex = keyIndex >= 0 ? keyIndex : state.index;
        const childRoute = state.routes[childIndex];
        const childRouter = childRouters[childRoute.routeName];
        if (childRouter) {
          const route = childRouter.getStateForAction(action, childRoute);
          if (route === null) {
            return state;
          }
          if (route && route !== childRoute) {
            return StateUtils.replaceAt(state, childRoute.key, route);
          }
        }
      }

      // Handle explicit push navigation action
      if (
        action.type === NavigationActions.NAVIGATE &&
        childRouters[action.routeName] !== undefined
      ) {
        const childRouter = childRouters[action.routeName];
        let route;
        if (childRouter) {
          const childAction =
            action.action || NavigationActions.init({ params: action.params });
          route = {
            params: action.params,
            ...childRouter.getStateForAction(childAction),
            key: _getUuid(),
            routeName: action.routeName,
          };
        } else {
          route = {
            params: action.params,
            key: _getUuid(),
            routeName: action.routeName,
          };
        }
        return StateUtils.push(state, route);
      }

      // Handle navigation to other child routers that are not yet pushed
      if (action.type === NavigationActions.NAVIGATE) {
        const childRouterNames = Object.keys(childRouters);
        for (let i = 0; i < childRouterNames.length; i++) {
          const childRouterName = childRouterNames[i];
          const childRouter = childRouters[childRouterName];
          if (childRouter) {
            // For each child router, start with a blank state
            const initChildRoute = childRouter.getStateForAction(
              NavigationActions.init()
            );
            // Then check to see if the router handles our navigate action
            const navigatedChildRoute = childRouter.getStateForAction(
              action,
              initChildRoute
            );
            let routeToPush = null;
            if (navigatedChildRoute === null) {
              // Push the route if the router has 'handled' the action and returned null
              routeToPush = initChildRoute;
            } else if (navigatedChildRoute !== initChildRoute) {
              // Push the route if the state has changed in response to this navigation
              routeToPush = navigatedChildRoute;
            }
            if (routeToPush) {
              return StateUtils.push(state, {
                ...routeToPush,
                key: _getUuid(),
                routeName: childRouterName,
              });
            }
          }
        }
      }

      if (action.type === NavigationActions.SET_PARAMS) {
        const lastRoute = state.routes.find(
          /* $FlowFixMe */
          (route: *) => route.key === action.key
        );
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
        const resetAction: NavigationResetAction = action;

        return {
          ...state,
          routes: resetAction.actions.map(
            (childAction: NavigationNavigateAction) => {
              const router = childRouters[childAction.routeName];
              if (router) {
                return {
                  ...childAction,
                  ...router.getStateForAction(childAction),
                  routeName: childAction.routeName,
                  key: _getUuid(),
                };
              }
              const route = {
                ...childAction,
                key: _getUuid(),
              };
              delete route.type;
              return route;
            }
          ),
          index: action.index,
        };
      }

      if (action.type === NavigationActions.BACK) {
        let backRouteIndex = null;
        if (action.key) {
          const backRoute = state.routes.find(
            /* $FlowFixMe */
            (route: *) => route.key === action.key
          );
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

    getPathAndParamsForState(
      state: NavigationState
    ): { path: string, params?: NavigationParams } {
      const route = state.routes[state.index];
      const routeName = route.routeName;
      const screen = getScreenForRouteName(routeConfigs, routeName);
      /* $FlowFixMe */
      const subPath = paths[routeName].toPath(route.params);
      let path = subPath;
      let params = route.params;
      if (screen && screen.router) {
        // If it has a router it's a navigator.
        // If it doesn't have router it's an ordinary React component.
        const child = screen.router.getPathAndParamsForState(route);
        path = subPath ? `${subPath}/${child.path}` : child.path;
        params = child.params ? { ...params, ...child.params } : params;
      }
      return {
        path,
        params,
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

      const [pathNameToResolve, queryString] = pathToResolve.split('?');

      // Attempt to match `pathNameToResolve` with a route in this router's
      // routeConfigs
      let matchedRouteName;
      let pathMatch;
      let pathMatchKeys;

      // eslint-disable-next-line no-restricted-syntax
      for (const [routeName, path] of Object.entries(paths)) {
        /* $FlowFixMe */
        const { re, keys } = path;
        pathMatch = re.exec(pathNameToResolve);
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

      // reduce the items of the query string. any query params may
      // be overridden by path params
      const queryParams = (queryString || '')
        .split('&')
        .reduce((result: *, item: string) => {
          if (item !== '') {
            const nextResult = result || {};
            const [key, value] = item.split('=');
            nextResult[key] = value;
            return nextResult;
          }
          return result;
        }, null);

      // reduce the matched pieces of the path into the params
      // of the route. `params` is null if there are no params.
      /* $FlowFixMe */
      const params = pathMatch
        .slice(1)
        .reduce((result: *, matchResult: *, i: number) => {
          const key = pathMatchKeys[i];
          if (key.asterisk || !key) {
            return result;
          }
          const nextResult = result || {};
          const paramName = key.name;
          nextResult[paramName] = matchResult;
          return nextResult;
        }, queryParams);

      return NavigationActions.navigate({
        routeName: matchedRouteName,
        ...(params ? { params } : {}),
        ...(nestedAction ? { action: nestedAction } : {}),
      });
    },

    getScreenOptions: createConfigGetter(
      routeConfigs,
      stackConfig.navigationOptions
    ),

    getScreenConfig: getScreenConfigDeprecated,
  };
};
