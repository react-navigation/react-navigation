import { nanoid } from 'nanoid/non-secure';

import { BaseRouter } from './BaseRouter';
import { createParamsFromAction } from './createParamsFromAction';
import type {
  CommonNavigationAction,
  DefaultRouterOptions,
  NavigationState,
  PartialState,
  Route,
  RouterConfigOptions,
} from './types';

export type SwitchActionType = {
  type: 'JUMP_TO';
  payload: { name: string; params?: object | undefined };
  source?: string | undefined;
  target?: string | undefined;
};

export type SwitchRouterOptions = DefaultRouterOptions & {
  /**
   * Control how going back should behave
   * - `firstRoute` - return to the first defined route
   * - `initialRoute` - return to the route from `initialRouteName`
   * - `order` - return to the route defined before the focused route
   * - `history` - return to last visited route; if the same route is visited multiple times, the older entries are dropped from the history
   * - `fullHistory` - return to last visited route; doesn't drop duplicate entries unlike `history` - matches behavior of web pages
   * - `none` - do not handle going back
   */
  backBehavior?: BackBehavior | undefined;
};

type BackBehavior =
  | 'firstRoute'
  | 'initialRoute'
  | 'order'
  | 'history'
  | 'fullHistory'
  | 'none';

type RouteHistory = {
  type: 'route';
  key: string;
  params?: object | undefined;
};

type DrawerHistory = {
  type: 'drawer';
  status: 'open' | 'closed';
};

type SwitchRouterState<History> = Omit<NavigationState, 'history' | 'type'> & {
  history: History[];
  preloadedRouteKeys: string[];
};

type SwitchRouterStateMap = {
  tab: SwitchRouterState<RouteHistory> & { type: 'tab' };
  drawer: SwitchRouterState<RouteHistory | DrawerHistory> & {
    type: 'drawer';
    default: DrawerHistory['status'];
  };
};

type SwitchRouterType = 'tab' | 'drawer';

const TYPE_ROUTE = 'route' as const;

const getRouteHistory = (
  routes: Route<string>[],
  index: number,
  backBehavior: BackBehavior,
  initialRouteName: string | undefined
) => {
  const route = routes[index];

  if (route == null) {
    throw new Error(`Couldn't find a route at index ${index}.`);
  }

  const history: RouteHistory[] = [
    {
      type: TYPE_ROUTE,
      key: route.key,
      params: backBehavior === 'fullHistory' ? route.params : undefined,
    },
  ];

  let initialRouteIndex;

  switch (backBehavior) {
    case 'order':
      for (let i = index; i > 0; i--) {
        const route = routes[i - 1];

        if (route == null) {
          throw new Error(`Couldn't find a route at index ${i - 1}.`);
        }

        history.unshift({
          type: TYPE_ROUTE,
          key: route.key,
        });
      }

      break;

    case 'firstRoute':
      if (index !== 0) {
        const route = routes[0];

        if (route == null) {
          throw new Error("Couldn't find a route at index 0.");
        }

        history.unshift({
          type: TYPE_ROUTE,
          key: route.key,
        });
      }

      break;

    case 'initialRoute':
      initialRouteIndex = routes.findIndex(
        (route) => route.name === initialRouteName
      );

      initialRouteIndex = initialRouteIndex === -1 ? 0 : initialRouteIndex;

      if (index !== initialRouteIndex) {
        const route = routes[initialRouteIndex];

        if (route == null) {
          throw new Error(
            `Couldn't find a route at index ${initialRouteIndex}.`
          );
        }

        history.unshift({
          type: TYPE_ROUTE,
          key: route.key,
        });
      }

      break;

    case 'history':
    case 'fullHistory':
      // The history will fill up on navigation
      break;
  }

  return history;
};

const changeIndex = <Type extends SwitchRouterType>(
  state: Pick<SwitchRouterStateMap[Type], 'routes' | 'history'>,
  index: number,
  backBehavior: BackBehavior,
  initialRouteName: string | undefined
): Pick<SwitchRouterStateMap[Type], 'index' | 'history'> => {
  let history = state.history;

  if (backBehavior === 'history' || backBehavior === 'fullHistory') {
    const currentRoute = state.routes[index];

    if (currentRoute == null) {
      throw new Error(`Couldn't find a route at index ${index}.`);
    }

    if (backBehavior === 'history') {
      // Remove the existing key from the history to de-duplicate it
      history = history.filter((it) =>
        it.type === 'route' ? it.key !== currentRoute.key : true
      );
    } else if (backBehavior === 'fullHistory') {
      const lastHistoryRouteItemIndex = history.findLastIndex(
        (item) => item.type === 'route'
      );

      const lastHistoryRouteItem = history[lastHistoryRouteItemIndex];

      if (
        lastHistoryRouteItem?.type === 'route' &&
        currentRoute.key === lastHistoryRouteItem.key
      ) {
        // For full-history, only remove if it matches the last route
        // Useful for drawer, if current route was in history, then drawer state changed
        // Then we only need to move the route to the front
        history = [
          ...history.slice(0, lastHistoryRouteItemIndex),
          ...history.slice(lastHistoryRouteItemIndex + 1),
        ];
      }
    }

    history = history.concat({
      type: TYPE_ROUTE,
      key: currentRoute.key,
      params: backBehavior === 'fullHistory' ? currentRoute.params : undefined,
    });
  } else {
    // Preserve non-route entries (e.g. drawer status) when rebuilding the history
    history = [
      ...state.history.filter((it) => it.type !== 'route'),
      ...getRouteHistory(state.routes, index, backBehavior, initialRouteName),
    ];
  }

  return {
    index,
    history,
  };
};

export function SwitchRouter<Type extends SwitchRouterType>({
  initialRouteName,
  backBehavior = 'firstRoute',
}: SwitchRouterOptions) {
  type State = SwitchRouterStateMap[Type];

  const router = {
    ...BaseRouter,

    getInitialState({
      routeNames,
      routeParamList,
    }: RouterConfigOptions): SwitchRouterState<RouteHistory> {
      const index =
        initialRouteName !== undefined && routeNames.includes(initialRouteName)
          ? routeNames.indexOf(initialRouteName)
          : 0;

      const routes = routeNames.map((name) => ({
        name,
        key: `${name}-${nanoid()}`,
        params: routeParamList[name],
      }));

      return {
        stale: false,
        key: nanoid(),
        index,
        routeNames,
        history: getRouteHistory(routes, index, backBehavior, initialRouteName),
        routes,
        preloadedRouteKeys: [],
      };
    },

    getRehydratedState(
      state: PartialState<State>,
      { routeNames, routeParamList }: RouterConfigOptions
    ): SwitchRouterState<RouteHistory> {
      const routes = routeNames.map((name) => {
        const route = state.routes.find((r) => r.name === name);

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
        } satisfies Route<string>;
      });

      const currentRoute = state.routes[state.index ?? 0];
      const index = Math.min(
        Math.max(currentRoute ? routeNames.indexOf(currentRoute.name) : 0, 0),
        routes.length - 1
      );

      const routeKeys = routes.map((route) => route.key);
      const history: RouteHistory[] = [];

      for (const item of state.history ?? []) {
        if (item.type === 'route' && routeKeys.includes(item.key)) {
          history.push(item);
        }
      }

      const stateData: SwitchRouterState<RouteHistory> = {
        stale: false,
        key: nanoid(),
        index,
        routeNames,
        history,
        routes,
        preloadedRouteKeys:
          state.preloadedRouteKeys?.filter((key) => routeKeys.includes(key)) ??
          [],
      };

      return {
        ...stateData,
        ...changeIndex<'tab'>(stateData, index, backBehavior, initialRouteName),
      };
    },

    getStateForRouteNamesChange(
      state: State,
      {
        routeNames,
        routeParamList,
        routeKeyChanges,
      }: RouterConfigOptions & { routeKeyChanges: string[] }
    ): State {
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

      const currentRoute = state.routes[state.index];

      if (currentRoute == null) {
        throw new Error(`Couldn't find a route at index ${state.index}.`);
      }

      let history = state.history.filter(
        // Type will always be 'route' for tabs, but could be different in a router extending this (e.g. drawer)
        (it) => it.type !== 'route' || routes.some((r) => r.key === it.key)
      );

      let index = routeNames.indexOf(currentRoute.name);

      if (index === -1) {
        // The focused route was removed, so focus the most recently visited surviving route
        const previousRouteItem = history.findLast(
          (item): item is RouteHistory => item.type === 'route'
        );

        index = Math.max(
          0,
          routes.findIndex((route) => route.key === previousRouteItem?.key)
        );
      }

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

    getStateForRouteFocus(state: State, key: string): State {
      const index = state.routes.findIndex((r) => r.key === key);

      if (index === -1 || index === state.index) {
        return state;
      }

      return {
        ...state,
        ...changeIndex<Type>(state, index, backBehavior, initialRouteName),
      };
    },

    getStateForAction(
      state: State,
      action: SwitchActionType | CommonNavigationAction,
      { routeParamList, routeGetIdList }: RouterConfigOptions
    ): State | PartialState<State> | null {
      switch (action.type) {
        case 'JUMP_TO':
        case 'NAVIGATE': {
          const index = state.routes.findIndex(
            (route) => route.name === action.payload.name
          );

          if (index === -1) {
            return null;
          }

          const route = state.routes[index];

          if (route == null) {
            throw new Error(`Couldn't find a route at index ${index}.`);
          }

          const getId = routeGetIdList[route.name];

          const currentId = getId?.({ params: route.params });
          const nextId = getId?.({ params: action.payload.params });

          const key =
            currentId === nextId ? route.key : `${route.name}-${nanoid()}`;

          let params;

          if (
            action.type === 'NAVIGATE' &&
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
            params = createParamsFromAction({ action, routeParamList });
          }

          const path =
            action.type === 'NAVIGATE' && action.payload.path != null
              ? action.payload.path
              : route.path;

          const nextRoute =
            params !== route.params || path !== route.path || key !== route.key
              ? { ...route, key, path, params }
              : route;

          const routes = state.routes.map((item, routeIndex) =>
            routeIndex === index ? nextRoute : item
          );

          const updatedState: State = {
            ...state,
            routes,
            history:
              key === route.key
                ? state.history
                : state.history.filter(
                    (it) => it.type !== 'route' || it.key !== route.key
                  ),
          };

          return {
            ...updatedState,
            ...changeIndex<Type>(
              updatedState,
              index,
              backBehavior,
              initialRouteName
            ),
            preloadedRouteKeys: updatedState.preloadedRouteKeys.filter(
              (key) => key !== route.key && key !== nextRoute.key
            ),
          };
        }

        case 'GO_BACK': {
          const focusedRoute = state.routes[state.index];

          if (focusedRoute == null) {
            throw new Error(`Couldn't find a route at index ${state.index}.`);
          }

          if (state.history.length === 1 && !focusedRoute.history?.length) {
            return null;
          }

          const lastHistoryItem = state.history[state.history.length - 1];

          if (
            lastHistoryItem?.type === 'route' &&
            focusedRoute.history?.length
          ) {
            const routes = [...state.routes];
            const history = [...focusedRoute.history];
            const last = history.pop();

            routes[state.index] = {
              ...focusedRoute,
              params:
                last?.type === 'params' ? last.params : focusedRoute.params,
              history,
            };

            return {
              ...state,
              routes,
            };
          }

          const previousHistoryItem = state.history[state.history.length - 2];

          if (
            previousHistoryItem == null ||
            previousHistoryItem.type !== 'route'
          ) {
            return null;
          }

          const previousKey = previousHistoryItem.key;
          const index = state.routes.findLastIndex(
            (route) => route.key === previousKey
          );

          if (index === -1) {
            return null;
          }

          let routes = state.routes;

          const previousRoute = routes[index];

          if (previousRoute == null) {
            throw new Error(`Couldn't find a route at index ${index}.`);
          }

          if (
            backBehavior === 'fullHistory' &&
            previousRoute.params !== previousHistoryItem.params
          ) {
            routes = [...state.routes];
            routes[index] = {
              ...previousRoute,
              params: previousHistoryItem.params,
            };
          }

          return {
            ...state,
            routes,
            preloadedRouteKeys: state.preloadedRouteKeys.filter(
              (key) => key !== previousRoute.key
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

          if (route == null) {
            throw new Error(`Couldn't find a route at index ${routeIndex}.`);
          }

          const getId = routeGetIdList[route.name];

          const currentId = getId?.({ params: route.params });
          const nextId = getId?.({ params: action.payload.params });

          const key =
            currentId === nextId ? route.key : `${route.name}-${nanoid()}`;

          const params = createParamsFromAction({ action, routeParamList });
          const newRoute =
            params !== route.params ? { ...route, key, params } : route;

          let history = state.history;

          if (key !== route.key) {
            history = history.filter(
              (record) => record.type !== 'route' || record.key !== route.key
            );

            if (routeIndex === state.index) {
              history = history.concat({
                type: TYPE_ROUTE,
                key: newRoute.key,
                params:
                  backBehavior === 'fullHistory' ? newRoute.params : undefined,
              });
            }
          }

          return {
            ...state,
            preloadedRouteKeys: state.preloadedRouteKeys
              .filter((key) => key !== route.key)
              .concat(newRoute.key),
            routes: state.routes.map((route, index) =>
              index === routeIndex ? newRoute : route
            ),
            history,
          };
        }

        default:
          return BaseRouter.getStateForAction(state, action);
      }
    },
  };

  return router;
}
