import { nanoid } from 'nanoid/non-secure';

import { BaseRouter } from './BaseRouter';
import type {
  CommonNavigationAction,
  DefaultRouterOptions,
  NavigationRoute,
  NavigationState,
  ParamListBase,
  Route,
  Router,
} from './types';

export type StackActionType =
  | {
      type: 'REPLACE';
      payload: { name: string; params?: object };
      source?: string;
      target?: string;
    }
  | {
      type: 'PUSH';
      payload: { name: string; params?: object };
      source?: string;
      target?: string;
    }
  | {
      type: 'POP';
      payload: { count: number };
      source?: string;
      target?: string;
    }
  | {
      type: 'POP_TO_TOP';
      source?: string;
      target?: string;
    }
  | {
      type: 'POP_TO';
      payload: {
        name: string;
        params?: object;
        merge?: boolean;
      };
      source?: string;
      target?: string;
    };

export type StackRouterOptions = DefaultRouterOptions;

export type StackNavigationState<ParamList extends ParamListBase> =
  NavigationState<ParamList> & {
    /**
     * Type of the router, in this case, it's stack.
     */
    type: 'stack';
    /**
     * List of routes, which are supposed to be preloaded before navigating to.
     */
    preloadedRoutes: NavigationRoute<ParamList, keyof ParamList>[];
  };

export type StackActionHelpers<ParamList extends ParamListBase> = {
  /**
   * Replace the current route with a new one.
   *
   * @param name Route name of the new route.
   * @param [params] Params object for the new route.
   */
  replace<RouteName extends keyof ParamList>(
    ...args: {
      [Screen in keyof ParamList]: undefined extends ParamList[Screen]
        ? [screen: Screen] | [screen: Screen, params: ParamList[Screen]]
        : [screen: Screen, params: ParamList[Screen]];
    }[RouteName]
  ): void;

  /**
   * Push a new screen onto the stack.
   *
   * @param name Name of the route for the tab.
   * @param [params] Params object for the route.
   */
  push<RouteName extends keyof ParamList>(
    ...args: {
      [Screen in keyof ParamList]: undefined extends ParamList[Screen]
        ? [screen: Screen] | [screen: Screen, params: ParamList[Screen]]
        : [screen: Screen, params: ParamList[Screen]];
    }[RouteName]
  ): void;

  /**
   * Pop a screen from the stack.
   */
  pop(count?: number): void;

  /**
   * Pop to the first route in the stack, dismissing all other screens.
   */
  popToTop(): void;

  /**
   * Pop any screens to go back to the specified screen.
   * If the specified screen doesn't exist, it'll be added to the stack.
   *
   * @param name Name of the route to navigate to.
   * @param [params] Params object for the route.
   * @param [merge] Whether to merge the params onto the route.
   */
  popTo<RouteName extends keyof ParamList>(
    ...args: {
      [Screen in keyof ParamList]: undefined extends ParamList[Screen]
        ?
            | [screen: Screen]
            | [screen: Screen, params: ParamList[Screen]]
            | [screen: RouteName, params: ParamList[Screen], merge: boolean]
        :
            | [screen: Screen, params: ParamList[Screen]]
            | [screen: RouteName, params: ParamList[Screen], merge: boolean];
    }[RouteName]
  ): void;
};

export const StackActions = {
  replace(name: string, params?: object): StackActionType {
    return { type: 'REPLACE', payload: { name, params } };
  },
  push(name: string, params?: object): StackActionType {
    return { type: 'PUSH', payload: { name, params } };
  },
  pop(count: number = 1): StackActionType {
    return { type: 'POP', payload: { count } };
  },
  popToTop(): StackActionType {
    return { type: 'POP_TO_TOP' };
  },
  popTo(name: string, params?: object, merge?: boolean): StackActionType {
    return { type: 'POP_TO', payload: { name, params, merge } };
  },
};

export function StackRouter(options: StackRouterOptions) {
  const router: Router<
    StackNavigationState<ParamListBase>,
    CommonNavigationAction | StackActionType
  > = {
    ...BaseRouter,

    type: 'stack',

    getInitialState({ routeNames, routeParamList }) {
      const initialRouteName =
        options.initialRouteName !== undefined &&
        routeNames.includes(options.initialRouteName)
          ? options.initialRouteName
          : routeNames[0];

      return {
        stale: false,
        type: 'stack',
        key: `stack-${nanoid()}`,
        index: 0,
        routeNames,
        preloadedRoutes: [],
        routes: [
          {
            key: `${initialRouteName}-${nanoid()}`,
            name: initialRouteName,
            params: routeParamList[initialRouteName],
          },
        ],
      };
    },

    getRehydratedState(partialState, { routeNames, routeParamList }) {
      const state = partialState;

      if (state.stale === false) {
        return state;
      }

      const routes = state.routes
        .filter((route) => routeNames.includes(route.name))
        .map((route) => ({
          ...route,
          key: route.key || `${route.name}-${nanoid()}`,
          params:
            routeParamList[route.name] !== undefined
              ? {
                  ...routeParamList[route.name],
                  ...route.params,
                }
              : route.params,
        }));

      const preloadedRoutes =
        state.preloadedRoutes
          ?.filter((route) => routeNames.includes(route.name))
          .map(
            (route) =>
              ({
                ...route,
                key: route.key || `${route.name}-${nanoid()}`,
                params:
                  routeParamList[route.name] !== undefined
                    ? {
                        ...routeParamList[route.name],
                        ...route.params,
                      }
                    : route.params,
              }) as Route<string>
          ) ?? [];

      if (routes.length === 0) {
        const initialRouteName =
          options.initialRouteName !== undefined
            ? options.initialRouteName
            : routeNames[0];

        routes.push({
          key: `${initialRouteName}-${nanoid()}`,
          name: initialRouteName,
          params: routeParamList[initialRouteName],
        });
      }

      return {
        stale: false,
        type: 'stack',
        key: `stack-${nanoid()}`,
        index: routes.length - 1,
        routeNames,
        routes,
        preloadedRoutes,
      };
    },

    getStateForRouteNamesChange(
      state,
      { routeNames, routeParamList, routeKeyChanges }
    ) {
      const routes = state.routes.filter(
        (route) =>
          routeNames.includes(route.name) &&
          !routeKeyChanges.includes(route.name)
      );

      if (routes.length === 0) {
        const initialRouteName =
          options.initialRouteName !== undefined &&
          routeNames.includes(options.initialRouteName)
            ? options.initialRouteName
            : routeNames[0];

        routes.push({
          key: `${initialRouteName}-${nanoid()}`,
          name: initialRouteName,
          params: routeParamList[initialRouteName],
        });
      }

      return {
        ...state,
        routeNames,
        routes,
        index: Math.min(state.index, routes.length - 1),
      };
    },

    getStateForRouteFocus(state, key) {
      const index = state.routes.findIndex((r) => r.key === key);

      if (index === -1 || index === state.index) {
        return state;
      }

      return {
        ...state,
        index,
        routes: state.routes.slice(0, index + 1),
      };
    },

    getStateForAction(state, action, options) {
      const { routeParamList } = options;

      switch (action.type) {
        case 'REPLACE': {
          const index =
            action.target === state.key && action.source
              ? state.routes.findIndex((r) => r.key === action.source)
              : state.index;

          if (index === -1) {
            return null;
          }

          const { name, params } = action.payload;

          if (!state.routeNames.includes(name)) {
            return null;
          }

          return {
            ...state,
            routes: state.routes.map((route, i) =>
              i === index
                ? {
                    key: `${name}-${nanoid()}`,
                    name,
                    params:
                      routeParamList[name] !== undefined
                        ? {
                            ...routeParamList[name],
                            ...params,
                          }
                        : params,
                  }
                : route
            ),
          };
        }

        case 'PUSH':
        case 'NAVIGATE': {
          if (!state.routeNames.includes(action.payload.name)) {
            return null;
          }

          const getId = options.routeGetIdList[action.payload.name];
          const id = getId?.({ params: action.payload.params });

          let route: Route<string> | undefined;

          if (id !== undefined) {
            route = state.routes.find(
              (route) =>
                route.name === action.payload.name &&
                id === getId?.({ params: route.params })
            );
          } else {
            const currentRoute = state.routes[state.index];

            // If the route matches the current one, then navigate to it
            if (
              action.type === 'NAVIGATE' &&
              action.payload.name === currentRoute.name
            ) {
              route = currentRoute;
            }
          }

          if (!route) {
            route = state.preloadedRoutes.find(
              (route) =>
                route.name === action.payload.name &&
                id === getId?.({ params: route.params })
            );
          }

          let params;

          if (action.type === 'NAVIGATE' && action.payload.merge && route) {
            params =
              action.payload.params !== undefined ||
              routeParamList[action.payload.name] !== undefined
                ? {
                    ...routeParamList[action.payload.name],
                    ...route.params,
                    ...action.payload.params,
                  }
                : route.params;
          } else {
            params =
              routeParamList[action.payload.name] !== undefined
                ? {
                    ...routeParamList[action.payload.name],
                    ...action.payload.params,
                  }
                : action.payload.params;
          }

          let routes: Route<string>[];

          if (route) {
            const routeKey = route.key;

            routes = state.routes.filter((r) => r.key !== routeKey);
            routes.push({
              ...route,
              path:
                action.type === 'NAVIGATE' && action.payload.path !== undefined
                  ? action.payload.path
                  : route.path,
              params,
            });
          } else {
            routes = [
              ...state.routes,
              {
                key: `${action.payload.name}-${nanoid()}`,
                name: action.payload.name,
                path:
                  action.type === 'NAVIGATE' ? action.payload.path : undefined,
                params,
              },
            ];
          }

          return {
            ...state,
            index: routes.length - 1,
            preloadedRoutes: state.preloadedRoutes.filter(
              (route) => routes[routes.length - 1].key !== route.key
            ),
            routes,
          };
        }

        case 'NAVIGATE_DEPRECATED': {
          if (
            state.preloadedRoutes.find(
              (route) =>
                route.name === action.payload.name &&
                id === getId?.({ params: route.params })
            )
          ) {
            return null;
          }
          if (!state.routeNames.includes(action.payload.name)) {
            return null;
          }

          // If the route already exists, navigate to that
          let index = -1;

          const getId = options.routeGetIdList[action.payload.name];
          const id = getId?.({ params: action.payload.params });

          if (id) {
            index = state.routes.findIndex(
              (route) =>
                route.name === action.payload.name &&
                id === getId?.({ params: route.params })
            );
          } else if (state.routes[state.index].name === action.payload.name) {
            index = state.index;
          } else {
            for (let i = state.routes.length - 1; i >= 0; i--) {
              if (state.routes[i].name === action.payload.name) {
                index = i;
                break;
              }
            }
          }

          if (index === -1) {
            const routes = [
              ...state.routes,
              {
                key: `${action.payload.name}-${nanoid()}`,
                name: action.payload.name,
                params:
                  routeParamList[action.payload.name] !== undefined
                    ? {
                        ...routeParamList[action.payload.name],
                        ...action.payload.params,
                      }
                    : action.payload.params,
              },
            ];

            return {
              ...state,
              routes,
              index: routes.length - 1,
            };
          }

          const route = state.routes[index];

          let params;

          if (action.payload.merge) {
            params =
              action.payload.params !== undefined ||
              routeParamList[route.name] !== undefined
                ? {
                    ...routeParamList[route.name],
                    ...route.params,
                    ...action.payload.params,
                  }
                : route.params;
          } else {
            params =
              routeParamList[route.name] !== undefined
                ? {
                    ...routeParamList[route.name],
                    ...action.payload.params,
                  }
                : action.payload.params;
          }

          return {
            ...state,
            index,
            routes: [
              ...state.routes.slice(0, index),
              params !== route.params
                ? { ...route, params }
                : state.routes[index],
            ],
          };
        }

        case 'POP': {
          const index =
            action.target === state.key && action.source
              ? state.routes.findIndex((r) => r.key === action.source)
              : state.index;

          if (index > 0) {
            const count = Math.max(index - action.payload.count + 1, 1);
            const routes = state.routes
              .slice(0, count)
              .concat(state.routes.slice(index + 1));

            return {
              ...state,
              index: routes.length - 1,
              routes,
            };
          }

          return null;
        }

        case 'POP_TO_TOP':
          return router.getStateForAction(
            state,
            {
              type: 'POP',
              payload: { count: state.routes.length - 1 },
            },
            options
          );

        case 'POP_TO': {
          if (!state.routeNames.includes(action.payload.name)) {
            return null;
          }

          // If the route already exists, navigate to that
          let index = -1;

          const getId = options.routeGetIdList[action.payload.name];
          const id = getId?.({ params: action.payload.params });

          if (id) {
            index = state.routes.findIndex(
              (route) =>
                route.name === action.payload.name &&
                id === getId?.({ params: route.params })
            );
          } else if (state.routes[state.index].name === action.payload.name) {
            index = state.index;
          } else {
            for (let i = state.routes.length - 1; i >= 0; i--) {
              if (state.routes[i].name === action.payload.name) {
                index = i;
                break;
              }
            }
          }

          // If the route doesn't exist, remove the current route and add the new one
          if (index === -1) {
            const routes = [
              ...state.routes.slice(0, -1),
              {
                key: `${action.payload.name}-${nanoid()}`,
                name: action.payload.name,
                params:
                  routeParamList[action.payload.name] !== undefined
                    ? {
                        ...routeParamList[action.payload.name],
                        ...action.payload.params,
                      }
                    : action.payload.params,
              },
            ];

            return {
              ...state,
              routes,
              index: routes.length - 1,
            };
          }

          const route = state.routes[index];

          let params;

          if (action.payload.merge) {
            params =
              action.payload.params !== undefined ||
              routeParamList[route.name] !== undefined
                ? {
                    ...routeParamList[route.name],
                    ...route.params,
                    ...action.payload.params,
                  }
                : route.params;
          } else {
            params =
              routeParamList[route.name] !== undefined
                ? {
                    ...routeParamList[route.name],
                    ...action.payload.params,
                  }
                : action.payload.params;
          }

          return {
            ...state,
            index,
            routes: [
              ...state.routes.slice(0, index),
              params !== route.params
                ? { ...route, params }
                : state.routes[index],
            ],
          };
        }

        case 'GO_BACK':
          if (state.index > 0) {
            return router.getStateForAction(
              state,
              {
                type: 'POP',
                payload: { count: 1 },
                target: action.target,
                source: action.source,
              },
              options
            );
          }

          return null;

        case 'PRELOAD': {
          const getId = options.routeGetIdList[action.payload.name];
          const id = getId?.({ params: action.payload.params });

          let route: Route<string> | undefined;

          if (id !== undefined) {
            route = state.routes.find(
              (route) =>
                route.name === action.payload.name &&
                id === getId?.({ params: route.params })
            );
          }

          if (route) {
            return {
              ...state,
              routes: state.routes.map((r) => {
                if (r.key !== route?.key) {
                  return r;
                }
                return {
                  ...r,
                  params:
                    routeParamList[action.payload.name] !== undefined
                      ? {
                          ...routeParamList[action.payload.name],
                          ...action.payload.params,
                        }
                      : action.payload.params,
                };
              }),
            };
          } else {
            return {
              ...state,
              preloadedRoutes: state.preloadedRoutes
                .filter(
                  (r) =>
                    r.name !== action.payload.name ||
                    id !== getId?.({ params: r.params })
                )
                .concat({
                  key: `${action.payload.name}-${nanoid()}`,
                  name: action.payload.name,
                  params:
                    routeParamList[action.payload.name] !== undefined
                      ? {
                          ...routeParamList[action.payload.name],
                          ...action.payload.params,
                        }
                      : action.payload.params,
                }),
            };
          }
        }

        default:
          return BaseRouter.getStateForAction(state, action);
      }
    },

    actionCreators: StackActions,
  };

  return router;
}
