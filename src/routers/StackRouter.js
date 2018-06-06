import pathToRegexp from 'path-to-regexp';

import NavigationActions from '../NavigationActions';
import StackActions from './StackActions';
import createConfigGetter from './createConfigGetter';
import getScreenForRouteName from './getScreenForRouteName';
import StateUtils from '../StateUtils';
import validateRouteConfigMap from './validateRouteConfigMap';
import invariant from '../utils/invariant';
import { generateKey } from './KeyGenerator';
import getNavigationActionCreators from './getNavigationActionCreators';

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
    action.type === StackActions.PUSH
  );
}

const defaultActionCreators = (route, navStateKey) => ({});

function isResetToRootStack(action) {
  return action.type === StackActions.RESET && action.key === null;
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
  const getCustomActionCreators =
    stackConfig.getCustomActionCreators || defaultActionCreators;

  const initialRouteName = stackConfig.initialRouteName || routeNames[0];

  const initialChildRouter = childRouters[initialRouteName];
  const pathsByRouteNames = { ...stackConfig.paths } || {};
  let paths = [];

  function getInitialState(action) {
    let route = {};
    const childRouter = childRouters[action.routeName];

    // This is a push-like action, and childRouter will be a router or null if we are responsible for this routeName
    if (behavesLikePushAction(action) && childRouter !== undefined) {
      let childState = {};
      // The router is null for normal leaf routes
      if (childRouter !== null) {
        const childAction =
          action.action || NavigationActions.init({ params: action.params });
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
    const params = (route.params || action.params || initialRouteParams) && {
      ...(route.params || {}),
      ...(action.params || {}),
      ...(initialRouteParams || {}),
    };
    const { initialRouteKey } = stackConfig;
    route = {
      ...route,
      ...(params ? { params } : {}),
      routeName: initialRouteName,
      key: action.key || (initialRouteKey || generateKey()),
    };
    return {
      key: 'StackRouterRoot',
      isTransitioning: false,
      index: 0,
      routes: [route],
    };
  }

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
  paths.sort((a, b) => b[1].priority - a[1].priority);

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

    getActionCreators(route, navStateKey) {
      return {
        ...getNavigationActionCreators(route),
        ...getCustomActionCreators(route, navStateKey),
        pop: (n, params) =>
          StackActions.pop({
            n,
            ...params,
          }),
        popToTop: params => StackActions.popToTop(params),
        push: (routeName, params, action) =>
          StackActions.push({
            routeName,
            params,
            action,
          }),
        replace: (replaceWith, params, action, newKey) => {
          if (typeof replaceWith === 'string') {
            return StackActions.replace({
              routeName: replaceWith,
              params,
              action,
              key: route.key,
              newKey,
            });
          }
          invariant(
            typeof replaceWith === 'object',
            'Must replaceWith an object or a string'
          );
          invariant(
            params == null,
            'Params must not be provided to .replace() when specifying an object'
          );
          invariant(
            action == null,
            'Child action must not be provided to .replace() when specifying an object'
          );
          invariant(
            newKey == null,
            'Child action must not be provided to .replace() when specifying an object'
          );
          return StackActions.replace(replaceWith);
        },
        reset: (actions, index) =>
          StackActions.reset({
            actions,
            index: index == null ? actions.length - 1 : index,
            key: navStateKey,
          }),
        dismiss: () =>
          NavigationActions.back({
            key: navStateKey,
          }),
      };
    },

    getStateForAction(action, state) {
      // Set up the initial state if needed
      if (!state) {
        return getInitialState(action);
      }

      // Check if the focused child scene wants to handle the action, as long as
      // it is not a reset to the root stack
      if (
        !isResetToRootStack(action) &&
        action.type !== NavigationActions.NAVIGATE
      ) {
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
      } else if (action.type === NavigationActions.NAVIGATE) {
        // Traverse routes from the top of the stack to the bottom, so the
        // active route has the first opportunity, then the one before it, etc.
        for (let childRoute of state.routes.slice().reverse()) {
          let childRouter = childRouters[childRoute.routeName];
          let childAction =
            action.routeName === childRoute.routeName && action.action
              ? action.action
              : action;

          if (childRouter) {
            const nextRouteState = childRouter.getStateForAction(
              childAction,
              childRoute
            );

            if (nextRouteState === null || nextRouteState !== childRoute) {
              const newState = StateUtils.replaceAndPrune(
                state,
                nextRouteState ? nextRouteState.key : childRoute.key,
                nextRouteState ? nextRouteState : childRoute
              );
              return {
                ...newState,
                isTransitioning:
                  state.index !== newState.index
                    ? action.immediate !== true
                    : state.isTransitioning,
              };
            }
          }
        }
      }

      // Handle explicit push navigation action. This must happen after the
      // focused child router has had a chance to handle the action.
      if (
        behavesLikePushAction(action) &&
        childRouters[action.routeName] !== undefined
      ) {
        const childRouter = childRouters[action.routeName];
        let route;

        invariant(
          action.type !== StackActions.PUSH || action.key == null,
          'StackRouter does not support key on the push action'
        );

        // Before pushing a new route we first try to find one in the existing route stack
        // More information on this: https://github.com/react-navigation/rfcs/blob/master/text/0004-less-pushy-navigate.md
        const lastRouteIndex = state.routes.findIndex(r => {
          if (action.key) {
            return r.key === action.key;
          } else {
            return r.routeName === action.routeName;
          }
        });

        if (action.type !== StackActions.PUSH && lastRouteIndex !== -1) {
          // If index is unchanged and params are not being set, leave state identity intact
          if (state.index === lastRouteIndex && !action.params) {
            return null;
          }

          // Remove the now unused routes at the tail of the routes array
          const routes = state.routes.slice(0, lastRouteIndex + 1);

          // Apply params if provided, otherwise leave route identity intact
          if (action.params) {
            const route = state.routes[lastRouteIndex];
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
                : state.isTransitioning,
            index: lastRouteIndex,
            routes,
          };
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
        action.type === StackActions.PUSH &&
        childRouters[action.routeName] === undefined
      ) {
        // Return the state identity to bubble the action up
        return state;
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

      // Handle pop-to-top behavior. Make sure this happens after children have had a chance to handle the action, so that the inner stack pops to top first.
      if (action.type === StackActions.POP_TO_TOP) {
        // Refuse to handle pop to top if a key is given that doesn't correspond
        // to this router
        if (action.key && state.key !== action.key) {
          return state;
        }

        // If we're already at the top, then we return the state with a new
        // identity so that the action is handled by this router.
        if (state.index > 0) {
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
      if (action.type === StackActions.REPLACE) {
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

      // Update transitioning state
      if (
        action.type === StackActions.COMPLETE_TRANSITION &&
        (action.key == null || action.key === state.key) &&
        state.isTransitioning
      ) {
        return {
          ...state,
          isTransitioning: false,
        };
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

      if (action.type === StackActions.RESET) {
        // Only handle reset actions that are unspecified or match this state key
        if (action.key != null && action.key != state.key) {
          // Deliberately use != instead of !== so we can match null with
          // undefined on either the state or the action
          return state;
        }
        const newStackActions = action.actions;

        return {
          ...state,
          routes: newStackActions.map(newStackAction => {
            const router = childRouters[newStackAction.routeName];

            let childState = {};

            if (router) {
              const childAction =
                newStackAction.action ||
                NavigationActions.init({ params: newStackAction.params });

              childState = router.getStateForAction(childAction);
            }

            return {
              params: newStackAction.params,
              ...childState,
              routeName: newStackAction.routeName,
              key: newStackAction.key || generateKey(),
            };
          }),
          index: action.index,
        };
      }

      if (
        action.type === NavigationActions.BACK ||
        action.type === StackActions.POP
      ) {
        const { key, n, immediate } = action;
        let backRouteIndex = state.index;
        if (action.type === StackActions.POP && n != null) {
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
          params: inputParams,
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
        const nextResult = result || inputParams || {};
        const paramName = key.name;

        let decodedMatchResult;
        try {
          decodedMatchResult = decodeURIComponent(matchResult);
        } catch (e) {
          // ignore `URIError: malformed URI`
        }

        nextResult[paramName] = decodedMatchResult || matchResult;
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
  };
};
