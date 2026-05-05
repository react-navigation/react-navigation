import { nanoid } from 'nanoid/non-secure';

import { BaseRouter } from './BaseRouter';
import { createParamsFromAction } from './createParamsFromAction';
import { createRouteFromAction } from './createRouteFromAction';
import type {
  CommonNavigationAction,
  DefaultRouterOptions,
  NavigationState,
  ParamListBase,
  Route,
  Router,
} from './types';

export type StackActionType =
  | {
      type: 'REPLACE';
      payload: { name: string; params?: object | undefined };
      source?: string | undefined;
      target?: string | undefined;
    }
  | {
      type: 'PUSH';
      payload: { name: string; params?: object | undefined };
      source?: string | undefined;
      target?: string | undefined;
    }
  | {
      type: 'POP';
      payload: { count: number };
      source?: string | undefined;
      target?: string | undefined;
    }
  | {
      type: 'POP_TO_TOP';
      source?: string | undefined;
      target?: string | undefined;
    }
  | {
      type: 'POP_TO';
      payload: {
        name: string;
        params?: object | undefined;
        merge?: boolean | undefined;
      };
      source?: string | undefined;
      target?: string | undefined;
    }
  | {
      type: 'RETAIN';
      payload: { enable: boolean };
      source?: string | undefined;
      target?: string | undefined;
    };

export type StackRouterOptions = DefaultRouterOptions;

export type StackNavigationState<ParamList extends ParamListBase> =
  NavigationState<ParamList> & {
    /**
     * Type of the router, in this case, it's stack.
     */
    type: 'stack';
    /**
     * List of route keys to retain in the stack.
     * When a retained route gets removed from the stack,
     * it'll be kept in routes and can be navigated to again.
     */
    retainedRouteKeys: string[];
  };

export type StackActionHelpers<ParamList extends ParamListBase> = {
  /**
   * Replace the current route with a new one.
   *
   * @param screen Name of the new route that will replace the current one.
   * @param [params] Params object for the new route.
   */
  replace<RouteName extends keyof ParamList>(
    ...args: RouteName extends unknown
      ? undefined extends ParamList[RouteName]
        ? [screen: RouteName, params?: ParamList[RouteName]]
        : [screen: RouteName, params: ParamList[RouteName]]
      : never
  ): void;

  /**
   * Push a new screen onto the stack.
   *
   * @param screen Name of the route to push onto the stack.
   * @param [params] Params object for the route.
   */
  push<RouteName extends keyof ParamList>(
    ...args: RouteName extends unknown
      ? undefined extends ParamList[RouteName]
        ? [screen: RouteName, params?: ParamList[RouteName]]
        : [screen: RouteName, params: ParamList[RouteName]]
      : never
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
   * @param screen Name of the route to pop to.
   * @param [params] Params object for the route.
   * @param [options.merge] Whether to merge the params onto the route. Defaults to `false`.
   */
  popTo<RouteName extends keyof ParamList>(
    ...args: RouteName extends unknown
      ? undefined extends ParamList[RouteName]
        ? [
            screen: RouteName,
            params?: ParamList[RouteName],
            options?: { merge?: boolean },
          ]
        : [
            screen: RouteName,
            params: ParamList[RouteName],
            options?: { merge?: boolean },
          ]
      : never
  ): void;

  /**
   * Enable or disable retaining the current route in the stack.
   * When a retained route gets removed from the stack,
   * it'll be kept in routes and can be navigated to again.
   *
   * @param enable Whether to retain the current route in the stack or not.
   */
  retain(enable: boolean): void;
};

export const StackActions = {
  replace(name: string, params?: object) {
    return {
      type: 'REPLACE',
      payload: { name, params },
    } as const satisfies StackActionType;
  },
  push(name: string, params?: object) {
    return {
      type: 'PUSH',
      payload: { name, params },
    } as const satisfies StackActionType;
  },
  pop(count: number = 1) {
    return {
      type: 'POP',
      payload: { count },
    } as const satisfies StackActionType;
  },
  popToTop() {
    return { type: 'POP_TO_TOP' } as const satisfies StackActionType;
  },
  popTo(name: string, params?: object, options?: { merge?: boolean }) {
    return {
      type: 'POP_TO',
      payload: {
        name,
        params,
        merge: options?.merge,
      },
    } as const satisfies StackActionType;
  },
  retain(enable: boolean) {
    return {
      type: 'RETAIN',
      payload: { enable },
    } as const satisfies StackActionType;
  },
};

function retainRoutes<ParamList extends ParamListBase>(
  previousState: StackNavigationState<ParamList>,
  nextState: StackNavigationState<ParamList>
) {
  if (!nextState.retainedRouteKeys.length) {
    return nextState;
  }

  const retainedRouteKeySet = new Set(nextState.retainedRouteKeys);
  const nextRouteKeySet = new Set(nextState.routes.map((route) => route.key));
  const retainedRoutes = getActiveRoutes(previousState).filter(
    (route) =>
      retainedRouteKeySet.has(route.key) && !nextRouteKeySet.has(route.key)
  );

  if (!retainedRoutes.length) {
    return nextState;
  }

  const removedRetainedRouteKeys = new Set(
    retainedRoutes.map((route) => route.key)
  );

  return getStateWithRoutes(
    nextState,
    getActiveRoutes(nextState),
    getPreloadedRoutes(nextState),
    retainedRoutes.concat(
      getRetainedRoutes(nextState).filter(
        (route) => !removedRetainedRouteKeys.has(route.key)
      )
    )
  );
}

const getActiveRoutes = <ParamList extends ParamListBase>(
  state: StackNavigationState<ParamList>
) => state.routes.slice(0, state.index + 1);

const getInactiveRoutes = <ParamList extends ParamListBase>(
  state: StackNavigationState<ParamList>
) => state.routes.slice(state.index + 1);

const getPreloadedRoutes = <ParamList extends ParamListBase>(
  state: StackNavigationState<ParamList>
) => {
  const retainedRouteKeySet = new Set(state.retainedRouteKeys);

  return getInactiveRoutes(state).filter(
    (route) => !retainedRouteKeySet.has(route.key)
  );
};

const getRetainedRoutes = <ParamList extends ParamListBase>(
  state: StackNavigationState<ParamList>
) => {
  const retainedRouteKeySet = new Set(state.retainedRouteKeys);

  return getInactiveRoutes(state).filter((route) =>
    retainedRouteKeySet.has(route.key)
  );
};

const getStateWithRoutes = <ParamList extends ParamListBase>(
  state: StackNavigationState<ParamList>,
  activeRoutes: Route<string>[],
  preloadedRoutes = getPreloadedRoutes(state),
  retainedRoutes = getRetainedRoutes(state)
) => {
  const routeKeySet = new Set(activeRoutes.map((route) => route.key));
  const retainedRouteKeySet = new Set(state.retainedRouteKeys);

  const filteredRetainedRoutes = retainedRoutes.filter(
    (route) => !routeKeySet.has(route.key)
  );

  const filteredPreloadedRoutes = preloadedRoutes.filter(
    (route) =>
      !retainedRouteKeySet.has(route.key) && !routeKeySet.has(route.key)
  );

  return {
    ...state,
    index: activeRoutes.length - 1,
    routes: activeRoutes.concat(
      filteredRetainedRoutes,
      filteredPreloadedRoutes
    ),
  };
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
        retainedRouteKeys: [],
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

      const index = Math.min(
        Math.max(state.index ?? routes.length - 1, 0),
        routes.length - 1
      );

      const routeKeys = new Set(routes.map((route) => route.key));
      const retainedRouteKeys =
        state.retainedRouteKeys?.filter((key) => routeKeys.has(key)) ?? [];

      return {
        stale: false,
        type: 'stack',
        key: `stack-${nanoid()}`,
        index,
        routeNames,
        routes,
        retainedRouteKeys,
      };
    },

    getStateForRouteNamesChange(
      state,
      { routeNames, routeParamList, routeKeyChanges }
    ) {
      const routes = getActiveRoutes(state).filter(
        (route) =>
          routeNames.includes(route.name) &&
          !routeKeyChanges.includes(route.name)
      );

      const preloadedRoutes = getPreloadedRoutes(state).filter(
        (route) =>
          routeNames.includes(route.name) &&
          !routeKeyChanges.includes(route.name)
      );

      const retainedRoutes = getRetainedRoutes(state).filter(
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

      const routeKeys = new Set(
        [...routes, ...preloadedRoutes, ...retainedRoutes].map(
          (route) => route.key
        )
      );

      const retainedRouteKeys = state.retainedRouteKeys.filter((key) =>
        routeKeys.has(key)
      );

      return getStateWithRoutes(
        {
          ...state,
          routeNames,
          retainedRouteKeys,
        },
        routes,
        preloadedRoutes,
        retainedRoutes
      );
    },

    getStateForRouteFocus(state, key) {
      const routes = getActiveRoutes(state);
      const index = routes.findIndex((r) => r.key === key);

      if (index === -1 || index === state.index) {
        return state;
      }

      return retainRoutes(
        state,
        getStateWithRoutes(state, routes.slice(0, index + 1))
      );
    },

    getStateForAction(state, action, options) {
      const { routeParamList } = options;

      const routes = getActiveRoutes(state);
      const preloadedRoutes = getPreloadedRoutes(state);
      const inactiveRoutes = getInactiveRoutes(state);

      switch (action.type) {
        case 'REPLACE': {
          const currentIndex =
            action.target === state.key && action.source
              ? routes.findIndex((r) => r.key === action.source)
              : state.index;

          if (currentIndex === -1) {
            return null;
          }

          if (!state.routeNames.includes(action.payload.name)) {
            return null;
          }

          const getId = options.routeGetIdList[action.payload.name];
          const id = getId?.({ params: action.payload.params });

          // Re-use inactive route if available
          let route = inactiveRoutes.find(
            (route) =>
              route.name === action.payload.name &&
              id === getId?.({ params: route.params })
          );

          if (!route) {
            route = createRouteFromAction({ action, routeParamList });
          }

          return retainRoutes(
            state,
            getStateWithRoutes(
              state,
              routes.map((r, i) => (i === currentIndex ? route : r)),
              preloadedRoutes.filter((r) => r.key !== route.key)
            )
          );
        }

        case 'PUSH':
        case 'NAVIGATE': {
          if (!state.routeNames.includes(action.payload.name)) {
            return null;
          }

          const getId = options.routeGetIdList[action.payload.name];
          const id = getId?.({ params: action.payload.params });

          let route: Route<string> | undefined;

          if (action.type === 'NAVIGATE') {
            const currentRoute = routes[state.index];

            if (id !== undefined) {
              if (
                currentRoute.name === action.payload.name &&
                id === getId?.({ params: currentRoute.params })
              ) {
                route = currentRoute;
              } else if (action.payload.pop) {
                for (let i = routes.length - 1; i >= 0; i--) {
                  const r = routes[i];

                  if (r.name !== action.payload.name) {
                    continue;
                  }

                  if (id === getId?.({ params: r.params })) {
                    route = r;
                    break;
                  }

                  if (r.history?.length) {
                    for (let j = r.history.length - 1; j >= 0; j--) {
                      if (
                        r.history[j].type === 'params' &&
                        id === getId?.({ params: r.history[j].params })
                      ) {
                        route = {
                          ...r,
                          params: r.history[j].params,
                          history: r.history.slice(0, j),
                        };
                        break;
                      }
                    }

                    if (route) {
                      break;
                    }
                  }
                }
              }
            } else {
              // If the route matches the current one, then navigate to it
              if (action.payload.name === currentRoute.name) {
                route = currentRoute;
              } else if (action.payload.pop) {
                route = routes.findLast(
                  (route) => route.name === action.payload.name
                );
              }
            }
          }

          if (!route) {
            route = inactiveRoutes.find(
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
            params = createParamsFromAction({ action, routeParamList });
          }

          let nextRoutes: Route<string>[];

          if (route) {
            if (action.type === 'NAVIGATE' && action.payload.pop) {
              nextRoutes = [];

              // Get all routes until the matching one
              for (const r of routes) {
                if (r.key === route.key) {
                  nextRoutes.push({
                    ...route,
                    path:
                      action.payload.path !== undefined
                        ? action.payload.path
                        : route.path,
                    params,
                  });
                  break;
                }

                nextRoutes.push(r);
              }

              if (!nextRoutes.some((r) => r.key === route.key)) {
                nextRoutes.push({
                  ...route,
                  path:
                    action.payload.path !== undefined
                      ? action.payload.path
                      : route.path,
                  params,
                });
              }
            } else {
              nextRoutes = routes.filter((r) => r.key !== route.key);
              nextRoutes.push({
                ...route,
                path:
                  action.type === 'NAVIGATE' &&
                  action.payload.path !== undefined
                    ? action.payload.path
                    : route.path,
                params,
              });
            }
          } else {
            nextRoutes = [
              ...routes,
              {
                key: `${action.payload.name}-${nanoid()}`,
                name: action.payload.name,
                path:
                  action.type === 'NAVIGATE' ? action.payload.path : undefined,
                params,
              },
            ];
          }

          return retainRoutes(
            state,
            getStateWithRoutes(
              state,
              nextRoutes,
              preloadedRoutes.filter(
                (route) => nextRoutes[nextRoutes.length - 1].key !== route.key
              )
            )
          );
        }

        case 'POP': {
          let currentIndex =
            action.target === state.key && action.source
              ? routes.findIndex((r) => r.key === action.source)
              : state.index;

          let route = routes[currentIndex];

          /**
           * When popping entries,
           * - Pop entries from route.history
           * - Pop routes from state.routes
           *
           * Repeat until:
           * - We have popped the amount of items in count
           * - There are no more items to pop
           */
          if (route.history?.length || currentIndex > 0) {
            let count = action.payload.count;
            let nextRoutes = routes;

            while (count > 0 && (route.history?.length || currentIndex > 0)) {
              if (route.history?.length) {
                nextRoutes = [...nextRoutes];

                const end = Math.min(count, route.history.length);
                const last = route.history.at(-end);
                const history = route.history.slice(0, -end);
                const removed = route.history.length - history.length;

                count = count - removed;

                nextRoutes[currentIndex] = {
                  ...route,
                  params: last?.type === 'params' ? last.params : route.params,
                  history,
                };
              }

              if (currentIndex > 0 && count > 0) {
                const length = nextRoutes.length;
                const end = Math.max(currentIndex - count + 1, 1);

                nextRoutes = nextRoutes
                  .slice(0, end)
                  .concat(nextRoutes.slice(currentIndex + 1));

                const removed = length - nextRoutes.length;

                count = count - removed;
                currentIndex = nextRoutes.length - 1;
                route = nextRoutes[currentIndex];
              }
            }

            return retainRoutes(state, getStateWithRoutes(state, nextRoutes));
          }

          return null;
        }

        case 'POP_TO_TOP': {
          let route = routes[0];

          if (state.index > 0 || route.history?.length) {
            if (route.history?.length) {
              route = {
                ...route,
                history: undefined,
              };
            }

            return retainRoutes(state, getStateWithRoutes(state, [route]));
          }

          return null;
        }

        case 'POP_TO': {
          const currentIndex =
            action.target === state.key && action.source
              ? routes.findLastIndex((r) => r.key === action.source)
              : state.index;

          if (currentIndex === -1) {
            return null;
          }

          if (!state.routeNames.includes(action.payload.name)) {
            return null;
          }

          // If the route already exists, navigate to it
          let index = -1;
          let historyIndex: number | undefined;

          const getId = options.routeGetIdList[action.payload.name];
          const id = getId?.({ params: action.payload.params });

          if (id !== undefined) {
            for (let i = currentIndex; i >= 0; i--) {
              const r = routes[i];

              if (r.name !== action.payload.name) {
                continue;
              }

              if (id === getId?.({ params: r.params })) {
                index = i;
                break;
              }

              if (r.history?.length) {
                for (let j = r.history.length - 1; j >= 0; j--) {
                  if (
                    r.history[j].type === 'params' &&
                    id === getId?.({ params: r.history[j].params })
                  ) {
                    index = i;
                    historyIndex = j;
                    break;
                  }
                }

                if (index !== -1) {
                  break;
                }
              }
            }
          } else if (routes[currentIndex].name === action.payload.name) {
            index = currentIndex;
          } else {
            for (let i = currentIndex; i >= 0; i--) {
              if (routes[i].name === action.payload.name) {
                index = i;
                break;
              }
            }
          }

          // If the route doesn't exist, remove the current route and add the new one
          if (index === -1) {
            // Re-use inactive route if available
            let route = inactiveRoutes.find(
              (route) =>
                route.name === action.payload.name &&
                id === getId?.({ params: route.params })
            );

            if (!route) {
              route = createRouteFromAction({ action, routeParamList });
            }

            const nextRoutes = routes.slice(0, currentIndex).concat(route);

            return retainRoutes(
              state,
              getStateWithRoutes(
                state,
                nextRoutes,
                preloadedRoutes.filter((r) => r.key !== route.key)
              )
            );
          }

          const route = routes[index];

          let baseParams = route.params;
          let history = route.history;

          if (historyIndex !== undefined && route.history) {
            baseParams = route.history[historyIndex].params;
            history = route.history.slice(0, historyIndex);
          }

          let params;

          if (action.payload.merge) {
            params =
              action.payload.params !== undefined ||
              routeParamList[route.name] !== undefined
                ? {
                    ...routeParamList[route.name],
                    ...baseParams,
                    ...action.payload.params,
                  }
                : baseParams;
          } else {
            params = createParamsFromAction({ action, routeParamList });
          }

          return retainRoutes(
            state,
            getStateWithRoutes(state, [
              ...routes.slice(0, index),
              params !== baseParams || historyIndex !== undefined
                ? { ...route, params, history }
                : routes[index],
            ])
          );
        }

        case 'GO_BACK':
          if (state.index > 0 || routes[state.index].history?.length) {
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

        case 'RETAIN': {
          const routeKey = action.source ?? routes[state.index].key;

          if (!state.routes.some((route) => route.key === routeKey)) {
            return null;
          }

          if (action.payload.enable) {
            if (state.retainedRouteKeys.includes(routeKey)) {
              return state;
            }

            return {
              ...state,
              retainedRouteKeys: [...state.retainedRouteKeys, routeKey],
            };
          }

          if (!state.retainedRouteKeys.includes(routeKey)) {
            return state;
          }

          return getStateWithRoutes(
            {
              ...state,
              retainedRouteKeys: state.retainedRouteKeys.filter(
                (key) => key !== routeKey
              ),
            },
            routes,
            preloadedRoutes.filter((route) => route.key !== routeKey)
          );
        }

        case 'PRELOAD': {
          const getId = options.routeGetIdList[action.payload.name];
          const id = getId?.({ params: action.payload.params });
          const params = createParamsFromAction({ action, routeParamList });

          let route: Route<string> | undefined;

          if (action.payload.reuse) {
            route = preloadedRoutes.findLast(
              (route) =>
                route.name === action.payload.name &&
                (id === undefined || id === getId?.({ params: route.params }))
            );

            if (route) {
              return getStateWithRoutes(
                state,
                routes,
                preloadedRoutes.map((r) =>
                  r.key === route?.key && r.params !== params
                    ? { ...r, params }
                    : r
                )
              );
            }
          }

          if (id !== undefined) {
            route = routes.findLast(
              (route) =>
                route.name === action.payload.name &&
                id === getId?.({ params: route.params })
            );
          } else if (action.payload.reuse) {
            route = routes.findLast(
              (route) => route.name === action.payload.name
            );
          }

          if (route) {
            return getStateWithRoutes(
              state,
              routes.map((r) =>
                r.key === route.key && r.params !== params
                  ? { ...r, params }
                  : r
              ),
              preloadedRoutes
            );
          } else {
            return getStateWithRoutes(
              state,
              routes,
              preloadedRoutes
                .filter(
                  (r) =>
                    r.name !== action.payload.name ||
                    id !== getId?.({ params: r.params })
                )
                .concat(createRouteFromAction({ action, routeParamList }))
            );
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
