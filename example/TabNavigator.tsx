/* eslint-disable react-native/no-inline-styles */

import * as React from 'react';
import shortid from 'shortid';
import {
  useNavigationBuilder,
  NavigationState,
  NavigationProp,
  CommonAction,
  InitialState,
  ScreenProps,
  ParamListBase,
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

const TabRouter = {
  initial({
    screens,
    partialState,
    initialRouteName = Object.keys(screens)[0],
  }: {
    screens: { [key: string]: ScreenProps };
    partialState?: InitialState | NavigationState;
    initialRouteName?: string;
  }): NavigationState {
    const routeNames = Object.keys(screens);

    let state = partialState;

    if (state === undefined) {
      const index = routeNames.indexOf(initialRouteName);

      state = {
        index,
        routes: routeNames.map(name => ({
          name,
          key: `${name}-${shortid()}`,
          params: screens[name].initialParams,
        })),
      };
    }

    if (state.names === undefined || state.key === undefined) {
      state = {
        ...state,
        names: state.names || routeNames,
        key: state.key || `tab-${shortid()}`,
      };
    }

    return state;
  },

  reduce(
    state: NavigationState,
    action: Action | CommonAction
  ): NavigationState | null {
    switch (action.type) {
      case 'JUMP_TO': {
        const index = state.routes.findIndex(
          route => route.name === action.payload.name
        );

        if (index === -1) {
          throw new Error(
            `Couldn't find route "${action.payload.name}" in the state.`
          );
        }

        return {
          ...state,
          routes:
            action.payload.params !== undefined
              ? state.routes.map((route, i) =>
                  i === index
                    ? {
                        ...route,
                        params: action.payload.params,
                      }
                    : route
                )
              : state.routes,
          index,
        };
      }

      case 'NAVIGATE': {
        const index = state.routes.findIndex(
          route => route.name === action.payload.name
        );

        if (index === -1) {
          return null;
        }

        return TabRouter.reduce(state, {
          type: 'JUMP_TO',
          payload: { name: action.payload.name },
        });
      }

      case 'RESET':
        if (
          action.payload.key === undefined ||
          action.payload.key === state.key
        ) {
          return {
            ...action.payload,
            key: state.key,
            names: state.names,
          };
        }

        return null;

      default:
        return null;
    }
  },

  actions: {
    jumpTo(name: string): Action {
      return { type: 'JUMP_TO', payload: { name } };
    },
  },
};

export default function TabNavigator(props: Props) {
  // The `navigation` object contains the navigation state and some helpers (e.g. push, pop)
  // The `descriptors` object contains `navigation` objects for children routes and helper for rendering a screen
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
