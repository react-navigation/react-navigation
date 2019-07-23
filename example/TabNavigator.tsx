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
} from '../src/index';

type Props = {
  initialRouteName?: string;
  children: React.ReactNode;
};

type Action = {
  type: 'JUMP_TO';
  payload: { name: string; params?: object };
};

export type TabNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;
};

export type TabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  NavigationState,
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

const TabRouter: Router<NavigationState, Action | CommonAction> = {
  ...BaseRouter,

  getInitialState({
    routeNames,
    initialRouteName = routeNames[0],
    initialParamsList,
  }) {
    const index = routeNames.indexOf(initialRouteName);

    return {
      key: `tab-${shortid()}`,
      index,
      routeNames,
      routes: routeNames.map(name => ({
        name,
        key: `${name}-${shortid()}`,
        params: initialParamsList[name],
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

  getStateForRouteNamesChange(state, { routeNames, initialParamsList }) {
    return {
      ...state,
      routeNames,
      routes: routeNames.map(
        name =>
          state.routes.find(r => r.name === name) || {
            name,
            key: `${name}-${shortid()}`,
            params: initialParamsList[name],
          }
      ),
    };
  },

  getStateForRouteFocus(state, key) {
    const index = state.routes.findIndex(r => r.key === key);

    if (index === -1 || index === state.index) {
      return state;
    }

    return { ...state, index };
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
            route => route.key === action.payload.name
          );
        }

        if (index === -1) {
          return null;
        }

        return {
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
          index,
        };
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

export function TabNavigator(props: Props) {
  const { state, descriptors } = useNavigationBuilder<
    NavigationState,
    TabNavigationOptions
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
