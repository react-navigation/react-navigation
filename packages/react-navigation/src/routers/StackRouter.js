import NavigationActions from '../NavigationActions';
import StackActions from './StackActions';
import createConfigGetter from './createConfigGetter';
import getScreenForRouteName from './getScreenForRouteName';
import StateUtils from '../StateUtils';
import validateRouteConfigMap from './validateRouteConfigMap';
import invariant from '../utils/invariant';
import { generateKey } from './KeyGenerator';
import { createPathParser } from './pathUtils';

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

  const {
    getPathAndParamsForRoute,
    getActionForPathAndParams,
  } = createPathParser(
    childRouters,
    routeConfigs,
    stackConfig.paths,
    initialRouteName,
    initialRouteParams
  );

  return {
    childRouters,

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

      const activeChildRoute = state.routes[state.index];

      if (
        !isResetToRootStack(action) &&
        action.type !== NavigationActions.NAVIGATE
      ) {
        // Let the active child router handle the action
        const activeChildRouter = childRouters[activeChildRoute.routeName];
        if (activeChildRouter) {
          const route = activeChildRouter.getStateForAction(
            action,
            activeChildRoute
          );
          if (route !== null && route !== activeChildRoute) {
            return StateUtils.replaceAt(
              state,
              activeChildRoute.key,
              route,
              // the following tells replaceAt to NOT change the index to this route for the setParam action, because people don't expect param-setting actions to switch the active route
              action.type === NavigationActions.SET_PARAMS
            );
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
              return {
                ...StateUtils.push(state, route),
                isTransitioning: action.immediate !== true,
              };
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

      // By this point in the router's state handling logic, we have handled the behavior of the active route, and handled any stack actions.
      // If we haven't returned by now, we should allow non-active child routers to handle this action, and switch to that index if the child state (route) does change..

      const keyIndex = action.key ? StateUtils.indexOf(state, action.key) : -1;

      // Traverse routes from the top of the stack to the bottom, so the
      // active route has the first opportunity, then the one before it, etc.
      for (let childRoute of state.routes.slice().reverse()) {
        if (childRoute.key === activeChildRoute.key) {
          // skip over the active child because we let it attempt to handle the action earlier
          continue;
        }
        // If a key is provided and in routes state then let's use that
        // knowledge to skip extra getStateForAction calls on other child
        // routers
        if (keyIndex >= 0 && childRoute.key !== action.key) {
          continue;
        }
        let childRouter = childRouters[childRoute.routeName];
        if (childRouter) {
          const route = childRouter.getStateForAction(action, childRoute);

          if (route === null) {
            return state;
          } else if (route && route !== childRoute) {
            return StateUtils.replaceAt(
              state,
              childRoute.key,
              route,
              // the following tells replaceAt to NOT change the index to this route for the setParam action, because people don't expect param-setting actions to switch the active route
              action.type === NavigationActions.SET_PARAMS
            );
          }
        }
      }

      return state;
    },

    getPathAndParamsForState(state) {
      const route = state.routes[state.index];
      return getPathAndParamsForRoute(route);
    },

    getActionForPathAndParams(path, params) {
      return getActionForPathAndParams(path, params);
    },

    getScreenOptions: createConfigGetter(
      routeConfigs,
      stackConfig.navigationOptions
    ),
  };
};
