import { nanoid } from 'nanoid/non-secure';

import { BaseRouter } from './BaseRouter';
import type {
  CommonNavigationAction,
  DefaultRouterOptions,
  NavigationState,
  ParamListBase,
  PartialState,
  Route,
  Router,
} from './types';

export type TabActionType = {
  type: 'JUMP_TO';
  payload: { name: string; params?: object };
  source?: string;
  target?: string;
};

export type BackBehavior =
  | 'initialRoute'
  | 'firstRoute'
  | 'history'
  | 'order'
  | 'none';

export type TabRouterOptions = DefaultRouterOptions & {
  backBehavior?: BackBehavior;
};

export type TabNavigationState<ParamList extends ParamListBase> = Omit<
  NavigationState<ParamList>,
  'history'
> & {
  /**
   * Type of the router, in this case, it's tab.
   */
  type: 'tab';
  /**
   * List of previously visited route keys.
   */
  history: { type: 'route'; key: string }[];
  /**
   * List of routes' key, which are supposed to be preloaded before navigating to.
   */
  preloadedRouteKeys: string[];
};

export type TabActionHelpers<ParamList extends ParamListBase> = {
  /**
   * Jump to an existing tab.
   *
   * @param screen Name of the route to jump to.
   * @param [params] Params object for the route.
   */
  jumpTo<RouteName extends keyof ParamList>(
    ...args: RouteName extends unknown
      ? undefined extends ParamList[RouteName]
        ? [screen: RouteName, params?: ParamList[RouteName]]
        : [screen: RouteName, params: ParamList[RouteName]]
      : never
  ): void;
};

const TYPE_ROUTE = 'route' as const;

export const TabActions = {
  jumpTo(name: string, params?: object): TabActionType {
    return { type: 'JUMP_TO', payload: { name, params } };
  },
};

const getRouteHistory = (
  routes: Route<string>[],
  index: number,
  backBehavior: BackBehavior,
  initialRouteName: string | undefined
) => {
  const history = [{ type: TYPE_ROUTE, key: routes[index].key }];
  let initialRouteIndex;

  switch (backBehavior) {
    case 'order':
      for (let i = index; i > 0; i--) {
        history.unshift({ type: TYPE_ROUTE, key: routes[i - 1].key });
      }
      break;
    case 'firstRoute':
      if (index !== 0) {
        history.unshift({
          type: TYPE_ROUTE,
          key: routes[0].key,
        });
      }
      break;
    case 'initialRoute':
      initialRouteIndex = routes.findIndex(
        (route) => route.name === initialRouteName
      );
      initialRouteIndex = initialRouteIndex === -1 ? 0 : initialRouteIndex;

      if (index !== initialRouteIndex) {
        history.unshift({
          type: TYPE_ROUTE,
          key: routes[initialRouteIndex].key,
        });
      }
      break;
    case 'history':
      // The history will fill up on navigation
      break;
  }

  return history;
};

const changeIndex = (
  state: TabNavigationState<ParamListBase>,
  index: number,
  backBehavior: BackBehavior,
  initialRouteName: string | undefined
) => {
  let history;

  if (backBehavior === 'history') {
    const currentKey = state.routes[index].key;

    history = state.history
      .filter((it) => (it.type === 'route' ? it.key !== currentKey : false))
      .concat({ type: TYPE_ROUTE, key: currentKey });
  } else {
    history = getRouteHistory(
      state.routes,
      index,
      backBehavior,
      initialRouteName
    );
  }

  return {
    ...state,
    index,
    history,
  };
};

export function TabRouter({
  initialRouteName,
  backBehavior = 'firstRoute',
}: TabRouterOptions) {
  const router: Router<
    TabNavigationState<ParamListBase>,
    TabActionType | CommonNavigationAction
  > = {
    ...BaseRouter,

    type: 'tab',

    getInitialState({ routeNames, routeParamList }) {
      const index =
        initialRouteName !== undefined && routeNames.includes(initialRouteName)
          ? routeNames.indexOf(initialRouteName)
          : 0;

      const routes = routeNames.map((name) => ({
        name,
        key: `${name}-${nanoid()}`,
        params: routeParamList[name],
      }));

      const history = getRouteHistory(
        routes,
        index,
        backBehavior,
        initialRouteName
      );

      return {
        stale: false,
        type: 'tab',
        key: `tab-${nanoid()}`,
        index,
        routeNames,
        history,
        routes,
        preloadedRouteKeys: [],
      };
    },

    getRehydratedState(partialState, { routeNames, routeParamList }) {
      const state = partialState;

      if (state.stale === false) {
        return state;
      }

      const routes = routeNames.map((name) => {
        const route = (
          state as PartialState<TabNavigationState<ParamListBase>>
        ).routes.find((r) => r.name === name);

        return {
          ...route,
          name,
          key:
            route && route.name === name && route.key
              ? route.key
              : `${name}-${nanoid()}`,
          params:
            routeParamList[name] !== undefined
              ? {
                  ...routeParamList[name],
                  ...(route ? route.params : undefined),
                }
              : route
                ? route.params
                : undefined,
        } as Route<string>;
      });

      const index = Math.min(
        Math.max(routeNames.indexOf(state.routes[state?.index ?? 0]?.name), 0),
        routes.length - 1
      );

      const routeKeys = routes.map((route) => route.key);

      const history =
        state.history?.filter((it) => routeKeys.includes(it.key)) ?? [];

      return changeIndex(
        {
          stale: false,
          type: 'tab',
          key: `tab-${nanoid()}`,
          index,
          routeNames,
          history,
          routes,
          preloadedRouteKeys:
            state.preloadedRouteKeys?.filter((key) =>
              routeKeys.includes(key)
            ) ?? [],
        },
        index,
        backBehavior,
        initialRouteName
      );
    },

    getStateForRouteNamesChange(
      state,
      { routeNames, routeParamList, routeKeyChanges }
    ) {
      const routes = routeNames.map(
        (name) =>
          state.routes.find(
            (r) => r.name === name && !routeKeyChanges.includes(r.name)
          ) || {
            name,
            key: `${name}-${nanoid()}`,
            params: routeParamList[name],
          }
      );

      const index = Math.max(
        0,
        routeNames.indexOf(state.routes[state.index].name)
      );

      let history = state.history.filter(
        // Type will always be 'route' for tabs, but could be different in a router extending this (e.g. drawer)
        (it) => it.type !== 'route' || routes.find((r) => r.key === it.key)
      );

      if (!history.length) {
        history = getRouteHistory(
          routes,
          index,
          backBehavior,
          initialRouteName
        );
      }

      return {
        ...state,
        history,
        routeNames,
        routes,
        index,
      };
    },

    getStateForRouteFocus(state, key) {
      const index = state.routes.findIndex((r) => r.key === key);

      if (index === -1 || index === state.index) {
        return state;
      }

      return changeIndex(state, index, backBehavior, initialRouteName);
    },

    getStateForAction(state, action, { routeParamList, routeGetIdList }) {
      switch (action.type) {
        case 'JUMP_TO':
        case 'NAVIGATE':
        case 'NAVIGATE_DEPRECATED': {
          const index = state.routes.findIndex(
            (route) => route.name === action.payload.name
          );

          if (index === -1) {
            return null;
          }

          const updatedState = changeIndex(
            {
              ...state,
              routes: state.routes.map((route) => {
                if (route.name !== action.payload.name) {
                  return route;
                }

                const getId = routeGetIdList[route.name];

                const currentId = getId?.({ params: route.params });
                const nextId = getId?.({ params: action.payload.params });

                const key =
                  currentId === nextId
                    ? route.key
                    : `${route.name}-${nanoid()}`;

                let params;

                if (
                  (action.type === 'NAVIGATE' ||
                    action.type === 'NAVIGATE_DEPRECATED') &&
                  action.payload.merge &&
                  currentId === nextId
                ) {
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

                const path =
                  action.type === 'NAVIGATE' && action.payload.path != null
                    ? action.payload.path
                    : route.path;

                return params !== route.params || path !== route.path
                  ? { ...route, key, path, params }
                  : route;
              }),
            },
            index,
            backBehavior,
            initialRouteName
          );

          return {
            ...updatedState,
            preloadedRouteKeys: updatedState.preloadedRouteKeys.filter(
              (key) => key !== state.routes[updatedState.index].key
            ),
          };
        }

        case 'GO_BACK': {
          if (state.history.length === 1) {
            return null;
          }

          const previousKey = state.history[state.history.length - 2]?.key;
          const index = state.routes.findIndex(
            (route) => route.key === previousKey
          );

          if (index === -1) {
            return null;
          }

          return {
            ...state,
            preloadedRouteKeys: state.preloadedRouteKeys.filter(
              (key) => key !== state.routes[index].key
            ),
            history: state.history.slice(0, -1),
            index,
          };
        }

        case 'PRELOAD': {
          const routeIndex = state.routes.findIndex(
            (route) => route.name === action.payload.name
          );
          if (routeIndex === -1) {
            return null;
          }
          const route = state.routes[routeIndex];

          const getId = routeGetIdList[route.name];

          const currentId = getId?.({ params: route.params });
          const nextId = getId?.({ params: action.payload.params });

          const key =
            currentId === nextId ? route.key : `${route.name}-${nanoid()}`;

          const params =
            action.payload.params !== undefined ||
            routeParamList[route.name] !== undefined
              ? {
                  ...routeParamList[route.name],
                  ...action.payload.params,
                }
              : undefined;

          const newRoute =
            params !== route.params ? { ...route, key, params } : route;

          return {
            ...state,
            preloadedRouteKeys: state.preloadedRouteKeys
              .filter((key) => key !== route.key)
              .concat(newRoute.key),
            routes: state.routes.map((route, index) =>
              index === routeIndex ? newRoute : route
            ),
            history:
              key === route.key
                ? state.history
                : state.history.filter((record) => record.key !== route.key),
          };
        }

        default:
          return BaseRouter.getStateForAction(state, action);
      }
    },

    actionCreators: TabActions,
  };

  return router;
}
