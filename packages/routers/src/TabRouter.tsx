import shortid from 'shortid';
import {
  CommonAction,
  BaseRouter,
  PartialState,
  NavigationState,
  DefaultRouterOptions,
  Router,
  Route,
} from '@react-navigation/core';

export type TabActionType = {
  type: 'JUMP_TO';
  payload: { name: string; params?: object };
  source?: string;
  target?: string;
};

export type TabRouterOptions = DefaultRouterOptions & {
  backBehavior?: 'initialRoute' | 'order' | 'history' | 'none';
};

export type TabNavigationState = NavigationState & {
  /**
   * Type of the router, in this case, it's tab.
   */
  type: 'tab';
  /**
   * List of previously visited route keys.
   */
  routeKeyHistory: string[];
};

export const TabActions = {
  jumpTo(name: string, params?: object): TabActionType {
    return { type: 'JUMP_TO', payload: { name, params } };
  },
};

const changeIndex = (state: TabNavigationState, index: number) => {
  const previousKey = state.routes[state.index].key;
  const currentKey = state.routes[index].key;
  const routeKeyHistory = state.routeKeyHistory
    .filter(key => key !== currentKey && key !== previousKey)
    .concat(previousKey);

  return {
    ...state,
    index,
    routeKeyHistory,
  };
};

export default function TabRouter({
  initialRouteName,
  backBehavior = 'history',
}: TabRouterOptions) {
  const router: Router<TabNavigationState, TabActionType | CommonAction> = {
    ...BaseRouter,

    type: 'tab',

    getInitialState({ routeNames, routeParamList }) {
      const index =
        initialRouteName !== undefined && routeNames.includes(initialRouteName)
          ? routeNames.indexOf(initialRouteName)
          : 0;

      return {
        stale: false,
        type: 'tab',
        key: `tab-${shortid()}`,
        index,
        routeNames,
        routeKeyHistory: [],
        routes: routeNames.map(name => ({
          name,
          key: `${name}-${shortid()}`,
          params: routeParamList[name],
        })),
      };
    },

    getRehydratedState(partialState, { routeNames, routeParamList }) {
      let state = partialState;

      if (state.stale === false) {
        return state;
      }

      const routes = routeNames.map(name => {
        const route = (state as PartialState<TabNavigationState>).routes.find(
          r => r.name === name
        );

        return {
          ...route,
          name,
          key:
            route && route.name === name && route.key
              ? route.key
              : `${name}-${shortid()}`,
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
        Math.max(
          typeof state.index === 'number'
            ? state.index
            : routeNames.indexOf(state.routes[0].name),
          0
        ),
        routes.length - 1
      );

      const routeKeyHistory = state.routeKeyHistory
        ? state.routeKeyHistory.filter(key => routes.find(r => r.key === key))
        : [];

      return {
        stale: false,
        type: 'tab',
        key: `tab-${shortid()}`,
        index,
        routeNames,
        routeKeyHistory,
        routes,
      };
    },

    getStateForRouteNamesChange(state, { routeNames, routeParamList }) {
      const routes = routeNames.map(
        name =>
          state.routes.find(r => r.name === name) || {
            name,
            key: `${name}-${shortid()}`,
            params: routeParamList[name],
          }
      );

      const index = Math.max(
        0,
        routeNames.indexOf(state.routes[state.index].name)
      );

      return {
        ...state,
        routeNames,
        routes,
        index,
      };
    },

    getStateForRouteFocus(state, key) {
      const index = state.routes.findIndex(r => r.key === key);

      if (index === -1 || index === state.index) {
        return state;
      }

      return changeIndex(state, index);
    },

    getStateForAction(state, action) {
      switch (action.type) {
        case 'JUMP_TO':
        case 'NAVIGATE': {
          let index = -1;

          if (action.type === 'NAVIGATE' && action.payload.key) {
            index = state.routes.findIndex(
              route => route.key === action.payload.key
            );
          } else {
            index = state.routes.findIndex(
              route => route.name === action.payload.name
            );
          }

          if (index === -1) {
            return null;
          }

          return changeIndex(
            {
              ...state,
              routes:
                action.payload.params !== undefined
                  ? state.routes.map((route, i) =>
                      i === index
                        ? {
                            ...route,
                            params: {
                              ...route.params,
                              ...action.payload.params,
                            },
                          }
                        : route
                    )
                  : state.routes,
            },
            index
          );
        }

        case 'GO_BACK':
          switch (backBehavior) {
            case 'initialRoute': {
              const index = initialRouteName
                ? state.routeNames.indexOf(initialRouteName)
                : 0;

              if (index === -1 || index === state.index) {
                return null;
              }

              return { ...state, index };
            }

            case 'order':
              if (state.index === 0) {
                return null;
              }

              return {
                ...state,
                index: state.index - 1,
              };

            case 'history': {
              const previousKey =
                state.routeKeyHistory[state.routeKeyHistory.length - 1];
              const index = state.routes.findIndex(
                route => route.key === previousKey
              );

              if (index === -1) {
                return null;
              }

              return {
                ...state,
                routeKeyHistory: state.routeKeyHistory.slice(0, -1),
                index,
              };
            }

            default:
              return null;
          }

        default:
          return BaseRouter.getStateForAction(state, action);
      }
    },

    shouldActionChangeFocus(action) {
      return action.type === 'NAVIGATE';
    },

    actionCreators: TabActions,
  };

  return router;
}
