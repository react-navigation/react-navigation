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
  TargetRoute,
  BaseRouter,
} from '../src/index';

type Props = {
  initialRouteName?: string;
  children: React.ReactNode;
};

type Action = {
  type: 'JUMP_TO';
  payload: { name?: string; key?: string; params?: object };
};

export type TabNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;
};

export type TabNavigationProp<ParamList extends ParamListBase> = NavigationProp<
  ParamList,
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
      ? [TargetRoute<RouteName>]
      : [TargetRoute<RouteName>, ParamList[RouteName]]
  ): void;
};

const TabRouter: Router<Action | CommonAction> = {
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

        if (action.payload.key) {
          index = state.routes.findIndex(
            route => route.key === action.payload.key
          );
        }

        if (action.payload.name) {
          index = state.routes.findIndex(
            route => route.name === action.payload.name
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
    jumpTo(target: TargetRoute<string>, params?: object) {
      if (typeof target === 'string') {
        return { type: 'JUMP_TO', payload: { name: target, params } };
      } else {
        if (
          (target.hasOwnProperty('key') && target.hasOwnProperty('name')) ||
          (!target.hasOwnProperty('key') && !target.hasOwnProperty('name'))
        ) {
          throw new Error(
            'While calling jumpTo you need to specify either name or key'
          );
        }
        return { type: 'JUMP_TO', payload: { ...target, params } };
      }
    },
  },
};

export function TabNavigator(props: Props) {
  const { state, descriptors } = useNavigationBuilder(TabRouter, props);

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
