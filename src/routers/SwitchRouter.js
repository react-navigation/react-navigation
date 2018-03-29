import invariant from '../utils/invariant';
import getScreenForRouteName from './getScreenForRouteName';
import createConfigGetter from './createConfigGetter';

import NavigationActions from '../NavigationActions';
import validateRouteConfigMap from './validateRouteConfigMap';
import getScreenConfigDeprecated from './getScreenConfigDeprecated';

function childrenUpdateWithoutSwitchingIndex(actionType) {
  return [
    NavigationActions.SET_PARAMS,
    NavigationActions.COMPLETE_TRANSITION,
  ].includes(actionType);
}

export default (routeConfigs, config = {}) => {
  // Fail fast on invalid route definitions
  validateRouteConfigMap(routeConfigs);

  const order = config.order || Object.keys(routeConfigs);
  const paths = config.paths || {};
  const initialRouteParams = config.initialRouteParams;
  const initialRouteName = config.initialRouteName || order[0];
  const backBehavior = config.backBehavior || 'none';
  const shouldBackNavigateToInitialRoute = backBehavior === 'initialRoute';
  const resetOnBlur = config.hasOwnProperty('resetOnBlur')
    ? config.resetOnBlur
    : true;
  const initialRouteIndex = order.indexOf(initialRouteName);
  const childRouters = {};

  order.forEach(routeName => {
    const routeConfig = routeConfigs[routeName];
    paths[routeName] =
      typeof routeConfig.path === 'string' ? routeConfig.path : routeName;
    childRouters[routeName] = null;
    const screen = getScreenForRouteName(routeConfigs, routeName);
    if (screen.router) {
      childRouters[routeName] = screen.router;
    }
  });
  if (initialRouteIndex === -1) {
    throw new Error(
      `Invalid initialRouteName '${initialRouteName}'.` +
        `Should be one of ${order.map(n => `"${n}"`).join(', ')}`
    );
  }

  function resetChildRoute(routeName) {
    const params =
      routeName === initialRouteName ? initialRouteParams : undefined;
    const childRouter = childRouters[routeName];
    if (childRouter) {
      const childAction = NavigationActions.init();
      return {
        ...childRouter.getStateForAction(childAction),
        key: routeName,
        routeName,
        params,
      };
    }
    return {
      key: routeName,
      routeName,
      params,
    };
  }

  return {
    getInitialState() {
      const routes = order.map(resetChildRoute);
      return {
        routes,
        index: initialRouteIndex,
        isTransitioning: false,
      };
    },

    getNextState(prevState, possibleNextState) {
      if (!prevState) {
        return possibleNextState;
      }

      let nextState;
      if (prevState.index !== possibleNextState.index && resetOnBlur) {
        const prevRouteName = prevState.routes[prevState.index].routeName;
        const nextRoutes = [...possibleNextState.routes];
        nextRoutes[prevState.index] = resetChildRoute(prevRouteName);

        return {
          ...possibleNextState,
          routes: nextRoutes,
        };
      } else {
        nextState = possibleNextState;
      }

      return nextState;
    },

    getStateForAction(action, inputState) {
      let prevState = inputState ? { ...inputState } : inputState;
      let state = inputState || this.getInitialState();
      let activeChildIndex = state.index;

      if (action.type === NavigationActions.INIT) {
        // NOTE(brentvatne): this seems weird... why are we merging these
        // params into child routes?
        // ---------------------------------------------------------------
        // Merge any params from the action into all the child routes
        const { params } = action;
        if (params) {
          state.routes = state.routes.map(route => ({
            ...route,
            params: {
              ...route.params,
              ...params,
              ...(route.routeName === initialRouteName
                ? initialRouteParams
                : null),
            },
          }));
        }
      }

      // Let the current child handle it
      const activeChildLastState = state.routes[state.index];
      const activeChildRouter = childRouters[order[state.index]];
      if (activeChildRouter) {
        const activeChildState = activeChildRouter.getStateForAction(
          action,
          activeChildLastState
        );
        if (!activeChildState && inputState) {
          return null;
        }
        if (activeChildState && activeChildState !== activeChildLastState) {
          const routes = [...state.routes];
          routes[state.index] = activeChildState;
          return this.getNextState(prevState, {
            ...state,
            routes,
          });
        }
      }

      // Handle tab changing. Do this after letting the current tab try to
      // handle the action, to allow inner children to change first
      if (backBehavior !== 'none') {
        const isBackEligible =
          action.key == null || action.key === activeChildLastState.key;
        if (action.type === NavigationActions.BACK) {
          if (isBackEligible && shouldBackNavigateToInitialRoute) {
            activeChildIndex = initialRouteIndex;
          } else {
            return state;
          }
        }
      }

      let didNavigate = false;
      if (action.type === NavigationActions.NAVIGATE) {
        const navigateAction = action;
        didNavigate = !!order.find((childId, i) => {
          if (childId === navigateAction.routeName) {
            activeChildIndex = i;
            return true;
          }
          return false;
        });
        if (didNavigate) {
          const childState = state.routes[activeChildIndex];
          let newChildState;

          const childRouter = childRouters[action.routeName];

          if (action.action) {
            newChildState = childRouter
              ? childRouter.getStateForAction(action.action, childState)
              : null;
          } else if (!childRouter && action.params) {
            newChildState = {
              ...childState,
              params: {
                ...(childState.params || {}),
                ...action.params,
              },
            };
          }

          if (newChildState && newChildState !== childState) {
            const routes = [...state.routes];
            routes[activeChildIndex] = newChildState;
            return this.getNextState(prevState, {
              ...state,
              routes,
              index: activeChildIndex,
            });
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
          return this.getNextState(prevState, {
            ...state,
            routes,
          });
        }
      }

      if (activeChildIndex !== state.index) {
        return this.getNextState(prevState, {
          ...state,
          index: activeChildIndex,
        });
      } else if (didNavigate && !inputState) {
        return state;
      } else if (didNavigate) {
        return null;
      }

      // Let other children handle it and switch to the first child that returns a new state
      let index = state.index;
      let routes = state.routes;
      order.find((childId, i) => {
        const childRouter = childRouters[childId];
        if (i === index) {
          return false;
        }
        let childState = routes[i];
        if (childRouter) {
          childState = childRouter.getStateForAction(action, childState);
        }
        if (!childState) {
          index = i;
          return true;
        }
        if (childState !== routes[i]) {
          routes = [...routes];
          routes[i] = childState;
          index = i;
          return true;
        }
        return false;
      });

      // Nested routers can be updated after switching children with actions such as SET_PARAMS
      // and COMPLETE_TRANSITION.
      // NOTE: This may be problematic with custom routers because we whitelist the actions
      // that can be handled by child routers without automatically changing index.
      if (childrenUpdateWithoutSwitchingIndex(action.type)) {
        index = state.index;
      }

      if (index !== state.index || routes !== state.routes) {
        return this.getNextState(prevState, {
          ...state,
          index,
          routes,
        });
      }
      return state;
    },

    getComponentForState(state) {
      const routeName = state.routes[state.index].routeName;
      invariant(
        routeName,
        `There is no route defined for index ${state.index}. Check that
        that you passed in a navigation state with a valid tab/screen index.`
      );
      const childRouter = childRouters[routeName];
      if (childRouter) {
        return childRouter.getComponentForState(state.routes[state.index]);
      }
      return getScreenForRouteName(routeConfigs, routeName);
    },

    getComponentForRouteName(routeName) {
      return getScreenForRouteName(routeConfigs, routeName);
    },

    getPathAndParamsForState(state) {
      const route = state.routes[state.index];
      const routeName = order[state.index];
      const subPath = paths[routeName];
      const screen = getScreenForRouteName(routeConfigs, routeName);
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

    /**
     * Gets an optional action, based on a relative path and query params.
     *
     * This will return null if there is no action matched
     */
    getActionForPathAndParams(path, params) {
      return (
        order
          .map(childId => {
            const parts = path.split('/');
            const pathToTest = paths[childId];
            if (parts[0] === pathToTest) {
              const childRouter = childRouters[childId];
              const action = NavigationActions.navigate({
                routeName: childId,
              });
              if (childRouter && childRouter.getActionForPathAndParams) {
                action.action = childRouter.getActionForPathAndParams(
                  parts.slice(1).join('/'),
                  params
                );
              } else if (params) {
                action.params = params;
              }
              return action;
            }
            return null;
          })
          .find(action => !!action) ||
        order
          .map(childId => {
            const childRouter = childRouters[childId];
            return (
              childRouter && childRouter.getActionForPathAndParams(path, params)
            );
          })
          .find(action => !!action) ||
        null
      );
    },

    getScreenOptions: createConfigGetter(
      routeConfigs,
      config.navigationOptions
    ),

    getScreenConfig: getScreenConfigDeprecated,
  };
};
