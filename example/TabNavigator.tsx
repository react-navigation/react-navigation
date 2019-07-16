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
} from '../src/index';

type Props = {
  initialRouteName?: string;
  children: React.ReactNode;
};

type Action = {
  type: 'JUMP_TO';
  payload: { name: string; params?: object };
};

export type TabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<ParamList, RouteName> & {
  /**
   * Jump to an existing tab.
   *
   * @param name Name of the route for the tab.
   * @param [params] Params object for the route.
   */
  jumpTo<RouteName extends keyof ParamList>(
    ...args: ParamList[RouteName] extends void
      ? [RouteName]
      : [RouteName, ParamList[RouteName]]
  ): void;
};

const TabRouter: Router<Action | CommonAction> = {
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

    if (state.routeNames === undefined || state.key === undefined) {
      state = {
        ...state,
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

  getStateForAction(state, action) {
    switch (action.type) {
      case 'JUMP_TO':
      case 'NAVIGATE':
        if (state.routeNames.includes(action.payload.name)) {
          const index = state.routes.findIndex(
            route => route.name === action.payload.name
          );

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

        return null;

      case 'REPLACE': {
        return {
          ...state,
          routes: state.routes.map((route, i) =>
            i === state.index
              ? {
                  key: `${action.payload.name}-${shortid()}`,
                  name: action.payload.name,
                  params: action.payload.params,
                }
              : route
          ),
        };
      }

      case 'RESET':
        if (
          action.payload.key === undefined ||
          action.payload.key === state.key
        ) {
          return {
            ...action.payload,
            key: state.key,
            routeNames: state.routeNames,
          };
        }

        return null;

      default:
        return null;
    }
  },

  getStateForChildUpdate(state, { update, focus, key }) {
    const index = state.routes.findIndex(r => r.key === key);

    if (index === -1) {
      return state;
    }

    return {
      ...state,
      index: focus ? index : state.index,
      routes: state.routes.map((route, i) =>
        i === index ? { ...route, state: update } : route
      ),
    };
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
  const { navigation, descriptors } = useNavigationBuilder(TabRouter, props);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
      {navigation.state.routes.map((route, i, self) => (
        <div
          key={route.key}
          style={{
            width: `${100 / self.length}%`,
            padding: 10,
            borderRadius: 3,
            backgroundColor: i === navigation.state.index ? 'tomato' : 'white',
          }}
        >
          {descriptors[route.key].render()}
        </div>
      ))}
    </div>
  );
}

export default createNavigator(TabNavigator);
