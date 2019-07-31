/* eslint-disable react-native/no-inline-styles */

import * as React from 'react';
import shortid from 'shortid';
import {
  useNavigationBuilder,
  NavigationProp,
  CommonAction,
  ParamListBase,
  Router,
  createNavigator,
  BaseRouter,
  NavigationState,
  DefaultRouterOptions,
} from '../src/index';

type Props = TabRouterOptions & {
  children: React.ReactNode;
};

type Action = {
  type: 'JUMP_TO';
  payload: { name: string; params?: object };
};

export type TabRouterOptions = DefaultRouterOptions & {
  backBehavior?: 'initialRoute' | 'order' | 'history' | 'none';
};

export type TabNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;
};

export type TabNavigationState = NavigationState & {
  /**
   * List of previously visited route keys.
   */
  routeKeyHistory: string[];
};

export type TabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  TabNavigationState,
  TabNavigationOptions
> & {
  /**
   * Jump to an existing tab.
   *
   * @param name Name of the route for the tab.
   * @param [params] Params object for the route.
   */
  jumpTo<RouteName extends Extract<keyof ParamList, string>>(
    ...args: ParamList[RouteName] extends void
      ? [RouteName]
      : [RouteName, ParamList[RouteName]]
  ): void;
};

function TabRouter({
  initialRouteName,
  backBehavior = 'history',
}: TabRouterOptions) {
  const router: Router<TabNavigationState, Action | CommonAction> = {
    ...BaseRouter,

    getInitialState({ routeNames, routeParamList }) {
      const index =
        initialRouteName === undefined
          ? 0
          : routeNames.indexOf(initialRouteName);

      return {
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

    getRehydratedState({ routeNames, partialState }) {
      let state = partialState;

      if (state.stale) {
        state = {
          ...state,
          stale: false,
          routeNames,
          key: `tab-${shortid()}`,
        };
      }

      return state;
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

      return {
        ...state,
        routeNames,
        routes,
        index: Math.min(state.index, routes.length - 1),
      };
    },

    getStateForRouteFocus(state, key) {
      const index = state.routes.findIndex(r => r.key === key);

      if (index === -1 || index === state.index) {
        return state;
      }

      return {
        ...state,
        routeKeyHistory: [
          ...new Set([...state.routeKeyHistory, state.routes[state.index].key]),
        ],
        index,
      };
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

          return {
            ...state,
            routeKeyHistory: [
              ...new Set([
                ...state.routeKeyHistory,
                state.routes[state.index].key,
              ]),
            ],
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
            index,
          };
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

    shouldActionPropagateToChildren(action) {
      return action.type === 'NAVIGATE';
    },

    shouldActionChangeFocus(action) {
      return action.type === 'NAVIGATE';
    },

    actionCreators: {
      jumpTo(name: string, params?: object) {
        return { type: 'JUMP_TO', payload: { name, params } };
      },
    },
  };

  return router;
}

export function TabNavigator(props: Props) {
  const { state, descriptors } = useNavigationBuilder<
    TabNavigationState,
    TabNavigationOptions,
    TabRouterOptions
  >(TabRouter, props);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
      {state.routes.map((route, i, self) => (
        <div
          key={route.key}
          style={{
            width: `${100 / self.length}%`,
            padding: 10,
            borderRadius: 3,
            backgroundColor: i === state.index ? 'tomato' : 'white',
          }}
        >
          {descriptors[route.key].render()}
        </div>
      ))}
    </div>
  );
}

export default createNavigator<TabNavigationOptions, typeof TabNavigator>(
  TabNavigator
);
