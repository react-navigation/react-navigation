import pathToRegexp from 'path-to-regexp';

import NavigationActions from '../NavigationActions';
import createConfigGetter from './createConfigGetter';
import getScreenForRouteName from './getScreenForRouteName';
import StateUtils from '../StateUtils';
import validateRouteConfigMap from './validateRouteConfigMap';
import getScreenConfigDeprecated from './getScreenConfigDeprecated';
import invariant from '../utils/invariant';
import { generateKey } from './KeyGenerator';

function isEmpty(obj) {
  if (!obj) return true;
  for (let key in obj) {
    return false;
  }
  return true;
}

function behavesLikePushAction(action) {
  return (
    action.type === NavigationActions.NAVIGATE ||
    action.type === NavigationActions.PUSH
  );
}

export default (routeConfigs, stackConfig = {}) => {
  // Fail fast on invalid route definitions
  validateRouteConfigMap(routeConfigs);

  const childRouters = {};
  const routeNames = Object.keys(routeConfigs);

  // Loop through routes and find child routers
  routeNames.forEach(routeName => {
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
  const pathsByRouteNames = { ...stackConfig.paths } || {};
  let paths = [];

  // Build paths for each route
  routeNames.forEach(routeName => {
    let pathPattern =
      pathsByRouteNames[routeName] || routeConfigs[routeName].path;
    let matchExact = !!pathPattern && !childRouters[routeName];
    if (pathPattern === undefined) {
      pathPattern = routeName;
    }
    const keys = [];
    let re, toPath, priority;
    if (typeof pathPattern === 'string') {
      // pathPattern may be either a string or a regexp object according to path-to-regexp docs.
      re = pathToRegexp(pathPattern, keys);
      toPath = pathToRegexp.compile(pathPattern);
      priority = 0;
    } else {
      // for wildcard match
      re = pathToRegexp('*', keys);
      toPath = () => '';
      matchExact = true;
      priority = -1;
    }
    if (!matchExact) {
      const wildcardRe = pathToRegexp(`${pathPattern}/*`, keys);
      re = new RegExp(`(?:${re.source})|(?:${wildcardRe.source})`);
    }
    pathsByRouteNames[routeName] = { re, keys, toPath, priority };
  });

  paths = Object.entries(pathsByRouteNames);
  paths.sort((a: [string, *], b: [string, *]) => b[1].priority - a[1].priority);

  return {
    getComponentForState(state) {
      const activeChildRoute = state.routes[state.index];
      const { routeName } = activeChildRoute;
      if (childRouters[routeName]) {
        return childRouters[routeName].getComponentForState(activeChildRoute);
      }
      return getScreenForRouteName(routeConfigs, routeName);
    },

    getComponentForRouteName(routeName) {
      return getScreenForRouteName(routeConfigs, routeName);
    },

    getStateForAction(action, state) {
      // Set up the initial state if needed
      if (!state) {
        let route = {};
        const childRouter = childRouters[action.routeName];
        // This is a push-like action, and childRouter will be a router or null if we are responsible for this routeName
        if (behavesLikePushAction(action) && childRouter !== undefined) {
          let childState = {};
          // The router is null for normal leaf routes
          if (childRouter !== null) {
            const childAction =
              action.action ||
              NavigationActions.init({ params: action.params });
            childState = childRouter.getStateForAction(childAction);
          }
          return {
            key: 'StackRouterRoot',
            isTransitioning: false,
            index: 0,
            routes: [
              {
                params: action.params,
                ...childState,
                key: action.key || generateKey(),
                routeName: action.routeName,
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
          ...(params ? { params } : {}),
          routeName: initialRouteName,
          key: action.key || generateKey(),
        };
        state = {
          key: 'StackRouterRoot',
          isTransitioning: false,
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
        invariant(
          childRoute,
          `StateUtils erroneously thought index ${childIndex} exists`
        );
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

      // Handle pop-to-top behavior. Make sure this happens after children have had a chance to handle the action, so that the inner stack pops to top first.
      if (action.type === NavigationActions.POP_TO_TOP) {
        if (state.index === 0) {
          return {
            ...state,
          };
        } else {
          return {
            ...state,
            isTransitioning: action.immediate !== true,
            index: 0,
            routes: [state.routes[0]],
          };
        }
        return state;
      }

      // Handle replace action
      if (action.type === NavigationActions.REPLACE) {
        const routeIndex = state.routes.findIndex(r => r.key === action.key);
        // Only replace if the key matches one of our routes
        if (routeIndex !== -1) {
          const childRouter = childRouters[action.routeName];
          let childState = {};
          if (childRouter) {
            const childAction =
              action.action ||
              NavigationActions.init({ params: action.params });
            childState = childRouter.getStateForAction(childAction);
          }
          const routes = [...state.routes];
          routes[routeIndex] = {
            params: action.params,
            // merge the child state in this order to allow params override
            ...childState,
            routeName: action.routeName,
            key: action.newKey || generateKey(),
          };
          return { ...state, routes };
        }
      }

      // Handle explicit push navigation action. Make sure this happens after children have had a chance to handle the action
      if (
        behavesLikePushAction(action) &&
        childRouters[action.routeName] !== undefined
      ) {
        const childRouter = childRouters[action.routeName];
        let route;

        invariant(
          action.type !== NavigationActions.PUSH || action.key == null,
          'StackRouter does not support key on the push action'
        );
        // With the navigate action, the key may be provided for pushing, or to navigate back to the key
        if (action.key) {
          const lastRouteIndex = state.routes.findIndex(
            r => r.key === action.key
          );
          if (lastRouteIndex !== -1) {
            // If index is unchanged and params are not being set, leave state identity intact
            if (state.index === lastRouteIndex && !action.params) {
              return state;
            }

            // Remove the now unused routes at the tail of the routes array
            const routes = state.routes.slice(0, lastRouteIndex + 1);

            // Apply params if provided, otherwise leave route identity intact
            if (action.params) {
              const route = state.routes.find(r => r.key === action.key);
              routes[lastRouteIndex] = {
                ...route,
                params: {
                  ...route.params,
                  ...action.params,
                },
              };
            }
            // Return state with new index. Change isTransitioning only if index has changed
            return {
              ...state,
              isTransitioning:
                state.index !== lastRouteIndex
                  ? action.immediate !== true
                  : undefined,
              index: lastRouteIndex,
              routes,
            };
          }
        }

        if (childRouter) {
          const childAction =
            action.action || NavigationActions.init({ params: action.params });
          route = {
            params: action.params,
            // merge the child state in this order to allow params override
            ...childRouter.getStateForAction(childAction),
            routeName: action.routeName,
            key: action.key || generateKey(),
          };
        } else {
          route = {
            params: action.params,
            routeName: action.routeName,
            key: action.key || generateKey(),
          };
        }
        return {
          ...StateUtils.push(state, route),
          isTransitioning: action.immediate !== true,
        };
      } else if (
        action.type === NavigationActions.PUSH &&
        childRouters[action.routeName] === undefined
      ) {
        return {
          ...state,
        };
      }

      if (
        action.type === NavigationActions.COMPLETE_TRANSITION &&
        (action.key == null || action.key === state.key) &&
        state.isTransitioning
      ) {
        return {
          ...state,
          isTransitioning: false,
        };
      }

      // Handle navigation to other child routers that are not yet pushed
      if (behavesLikePushAction(action)) {
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
              const route = {
                ...routeToPush,
                routeName: childRouterName,
                key: action.key || generateKey(),
              };
              return StateUtils.push(state, route);
            }
          }
        }
      }

      if (action.type === NavigationActions.SET_PARAMS) {
        const key = action.key;
        const lastRoute = state.routes.find(route => route.key === key);
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
        // Only handle reset actions that are unspecified or match this state key
        if (action.key != null && action.key != state.key) {
          // Deliberately use != instead of !== so we can match null with
          // undefined on either the state or the action
          return state;
        }
        const resetAction = action;

        return {
          ...state,
          routes: resetAction.actions.map(childAction => {
            const router = childRouters[childAction.routeName];
            let childState = {};
            if (router) {
              childState = router.getStateForAction(childAction);
            }
            return {
              params: childAction.params,
              ...childState,
              routeName: childAction.routeName,
              key: childAction.key || generateKey(),
            };
          }),
          index: action.index,
        };
      }

      if (
        action.type === NavigationActions.BACK ||
        action.type === NavigationActions.POP
      ) {
        const { key, n, immediate } = action;
        let backRouteIndex = state.index;
        if (action.type === NavigationActions.POP && n != null) {
          // determine the index to go back *from*. In this case, n=1 means to go
          // back from state.index, as if it were a normal "BACK" action
          backRouteIndex = Math.max(1, state.index - n + 1);
        } else if (key) {
          const backRoute = state.routes.find(route => route.key === key);
          backRouteIndex = state.routes.indexOf(backRoute);
        }

        if (backRouteIndex > 0) {
          return {
            ...state,
            routes: state.routes.slice(0, backRouteIndex),
            index: backRouteIndex - 1,
            isTransitioning: immediate !== true,
          };
        } else if (
          backRouteIndex === 0 &&
          action.type === NavigationActions.POP
        ) {
          return {
            ...state,
          };
        }
      }
      return state;
    },

    getPathAndParamsForState(state) {
      const route = state.routes[state.index];
      const routeName = route.routeName;
      const screen = getScreenForRouteName(routeConfigs, routeName);
      const subPath = pathsByRouteNames[routeName].toPath(route.params);
      let path = subPath;
      let params = route.params;
      if (screen && screen.router) {
        const stateRoute = route;
        // If it has a router it's a navigator.
        // If it doesn't have router it's an ordinary React component.
        const child = screen.router.getPathAndParamsForState(stateRoute);
        path = subPath ? `${subPath}/${child.path}` : child.path;
        params = child.params ? { ...params, ...child.params } : params;
      }
      return {
        path,
        params,
      };
    },

    getActionForPathAndParams(pathToResolve, inputParams) {
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
      for (const [routeName, path] of paths) {
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
        // If the path is empty (null or empty string)
        // just return the initial route action
        if (!pathToResolve) {
          return NavigationActions.navigate({
            routeName: initialRouteName,
          });
        }
        return null;
      }

      // Determine nested actions:
      // If our matched route for this router is a child router,
      // get the action for the path AFTER the matched path for this
      // router
      let nestedAction;
      let nestedQueryString = queryString ? '?' + queryString : '';
      if (childRouters[matchedRouteName]) {
        nestedAction = childRouters[matchedRouteName].getActionForPathAndParams(
          pathMatch.slice(pathMatchKeys.length).join('/') + nestedQueryString
        );
        if (!nestedAction) {
          return null;
        }
      }

      // reduce the items of the query string. any query params may
      // be overridden by path params
      const queryParams = !isEmpty(inputParams)
        ? inputParams
        : (queryString || '').split('&').reduce((result, item) => {
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
      const params = pathMatch.slice(1).reduce((result, matchResult, i) => {
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
