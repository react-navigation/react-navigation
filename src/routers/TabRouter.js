/* @flow */

import invariant from '../utils/invariant';
import getScreenForRouteName from './getScreenForRouteName';
import createConfigGetter from './createConfigGetter';

import NavigationActions from '../NavigationActions';
import validateRouteConfigMap from './validateRouteConfigMap';
import getScreenConfigDeprecated from './getScreenConfigDeprecated';

import type {
  NavigationComponent,
  NavigationState,
  NavigationRouteConfigMap,
  NavigationParams,
  NavigationRouter,
  NavigationRoute,
  NavigationNavigateAction,
  NavigationTabRouterConfig,
  NavigationTabAction,
  NavigationStateRoute,
} from '../TypeDefinition';

export default (
  routeConfigs: NavigationRouteConfigMap,
  config: NavigationTabRouterConfig = {}
): NavigationRouter<NavigationState, NavigationTabAction, *> => {
  // Fail fast on invalid route definitions
  validateRouteConfigMap(routeConfigs);

  const order = config.order || Object.keys(routeConfigs);
  const paths = config.paths || {};
  const initialRouteName = config.initialRouteName || order[0];
  const initialRouteIndex = order.indexOf(initialRouteName);
  const backBehavior = config.backBehavior || 'initialRoute';
  const shouldBackNavigateToInitialRoute = backBehavior === 'initialRoute';
  const tabRouters = {};
  order.forEach((routeName: string) => {
    const routeConfig = routeConfigs[routeName];
    paths[routeName] =
      typeof routeConfig.path === 'string' ? routeConfig.path : routeName;
    tabRouters[routeName] = null;
    if (routeConfig.screen && routeConfig.screen.router) {
      tabRouters[routeName] = routeConfig.screen.router;
    }
  });
  if (initialRouteIndex === -1) {
    throw new Error(
      `Invalid initialRouteName '${initialRouteName}' for TabRouter. ` +
        `Should be one of ${order.map((n: *) => `"${n}"`).join(', ')}`
    );
  }
  return {
    getStateForAction(
      action: NavigationTabAction,
      inputState?: ?NavigationState
    ): ?NavigationState {
      // Establish a default state
      let state = inputState;
      if (!state) {
        const routes = order.map((routeName: string) => {
          const tabRouter = tabRouters[routeName];
          if (tabRouter) {
            const childAction =
              action.action ||
              NavigationActions.init({
                ...(action.params ? { params: action.params } : {}),
              });
            return {
              ...tabRouter.getStateForAction(childAction),
              key: routeName,
              routeName,
            };
          }
          return {
            key: routeName,
            routeName,
          };
        });
        state = {
          routes,
          index: initialRouteIndex,
        };
        // console.log(`${order.join('-')}: Initial state`, {state});
      }

      if (action.type === NavigationActions.INIT) {
        // Merge any params from the action into all the child routes
        const { params } = action;
        if (params) {
          state.routes = state.routes.map(
            (route: *) =>
              ({
                ...route,
                params: {
                  ...route.params,
                  ...params,
                },
              }: NavigationRoute)
          );
        }
      }

      // Let the current tab handle it
      const activeTabLastState = state.routes[state.index];
      const activeTabRouter = tabRouters[order[state.index]];
      if (activeTabRouter) {
        const activeTabState = activeTabRouter.getStateForAction(
          action.action || action,
          activeTabLastState
        );
        if (!activeTabState && inputState) {
          return null;
        }
        if (activeTabState && activeTabState !== activeTabLastState) {
          const routes = [...state.routes];
          routes[state.index] = activeTabState;
          return {
            ...state,
            routes,
          };
        }
      }

      // Handle tab changing. Do this after letting the current tab try to
      // handle the action, to allow inner tabs to change first
      let activeTabIndex = state.index;
      const isBackEligible =
        action.key == null || action.key === activeTabLastState.key;
      if (
        action.type === NavigationActions.BACK &&
        isBackEligible &&
        shouldBackNavigateToInitialRoute
      ) {
        activeTabIndex = initialRouteIndex;
      }
      let didNavigate = false;
      if (action.type === NavigationActions.NAVIGATE) {
        const navigateAction = ((action: *): NavigationNavigateAction);
        didNavigate = !!order.find((tabId: string, i: number) => {
          if (tabId === navigateAction.routeName) {
            activeTabIndex = i;
            return true;
          }
          return false;
        });
        if (didNavigate) {
          const childState = state.routes[activeTabIndex];
          let newChildState;

          const tabRouter = tabRouters[action.routeName];

          if (action.action) {
            newChildState = tabRouter
              ? tabRouter.getStateForAction(action.action, childState)
              : null;
          } else if (!tabRouter && action.params) {
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
            routes[activeTabIndex] = newChildState;
            return {
              ...state,
              routes,
              index: activeTabIndex,
            };
          }
        }
      }
      if (action.type === NavigationActions.SET_PARAMS) {
        const key = action.key;
        const lastRoute = state.routes.find(
          (route: NavigationRoute) => route.key === key
        );
        if (lastRoute) {
          const params = {
            ...lastRoute.params,
            ...action.params,
          };
          const routes = [...state.routes];
          routes[state.routes.indexOf(lastRoute)] = ({
            ...lastRoute,
            params,
          }: NavigationRoute);
          return {
            ...state,
            routes,
          };
        }
      }
      if (activeTabIndex !== state.index) {
        return {
          ...state,
          index: activeTabIndex,
        };
      } else if (didNavigate && !inputState) {
        return state;
      } else if (didNavigate) {
        return null;
      }

      // Let other tabs handle it and switch to the first tab that returns a new state
      let index = state.index;
      /* $FlowFixMe */
      let routes: Array<NavigationState> = state.routes;
      order.find((tabId: string, i: number) => {
        const tabRouter = tabRouters[tabId];
        if (i === index) {
          return false;
        }
        let tabState = routes[i];
        if (tabRouter) {
          // console.log(`${order.join('-')}: Processing child router:`, {action, tabState});
          tabState = tabRouter.getStateForAction(action, tabState);
        }
        if (!tabState) {
          index = i;
          return true;
        }
        if (tabState !== routes[i]) {
          routes = [...routes];
          routes[i] = tabState;
          index = i;
          return true;
        }
        return false;
      });
      // console.log(`${order.join('-')}: Processed other tabs:`, {lastIndex: state.index, index});

      // keep active tab index if action type is SET_PARAMS
      index =
        action.type === NavigationActions.SET_PARAMS ? state.index : index;

      if (index !== state.index || routes !== state.routes) {
        return {
          ...state,
          index,
          routes,
        };
      }
      return state;
    },

    getComponentForState(state: NavigationState): NavigationComponent {
      const routeName = order[state.index];
      invariant(
        routeName,
        `There is no route defined for index ${state.index}. Check that
        that you passed in a navigation state with a valid tab/screen index.`
      );
      const childRouter = tabRouters[routeName];
      if (childRouter) {
        return childRouter.getComponentForState(state.routes[state.index]);
      }
      return getScreenForRouteName(routeConfigs, routeName);
    },

    getComponentForRouteName(routeName: string): NavigationComponent {
      return getScreenForRouteName(routeConfigs, routeName);
    },

    getPathAndParamsForState(state: NavigationState) {
      const route = state.routes[state.index];
      const routeName = order[state.index];
      const subPath = paths[routeName];
      const screen = getScreenForRouteName(routeConfigs, routeName);
      let path = subPath;
      let params = route.params;
      if (screen && screen.router) {
        // $FlowFixMe there's no way type the specific shape of the nav state
        const stateRoute: NavigationStateRoute = route;
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
    getActionForPathAndParams(
      path: string,
      params: ?NavigationParams
    ): ?NavigationTabAction {
      return (
        order
          .map((tabId: string) => {
            const parts = path.split('/');
            const pathToTest = paths[tabId];
            if (parts[0] === pathToTest) {
              const tabRouter = tabRouters[tabId];
              const action: NavigationNavigateAction = NavigationActions.navigate(
                {
                  routeName: tabId,
                }
              );
              if (tabRouter && tabRouter.getActionForPathAndParams) {
                action.action = tabRouter.getActionForPathAndParams(
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
          .find((action: *) => !!action) ||
        order
          .map((tabId: string) => {
            const tabRouter = tabRouters[tabId];
            return (
              tabRouter && tabRouter.getActionForPathAndParams(path, params)
            );
          })
          .find((action: *) => !!action) ||
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
