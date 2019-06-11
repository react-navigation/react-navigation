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

type Action =
  | {
      type: 'PUSH';
      payload: { name: string; params?: object };
    }
  | { type: 'POP' };

export type StackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<ParamList, RouteName> & {
  /**
   * Push a new screen onto the stack.
   *
   * @param name Name of the route for the tab.
   * @param [params] Params object for the route.
   */
  push<RouteName extends keyof ParamList>(
    ...args: ParamList[RouteName] extends void
      ? [RouteName]
      : [RouteName, ParamList[RouteName]]
  ): void;

  /**
   * Pop a screen from the stack.
   */
  pop(): void;
};

const StackRouter = {
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
        routes: routeNames.slice(0, index + 1).map(name => ({
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
        key: state.key || `stack-${shortid()}`,
      };
    }

    return state;
  },

  reduce(
    state: NavigationState,
    action: Action | CommonAction
  ): NavigationState | null {
    switch (action.type) {
      case 'PUSH':
        return {
          ...state,
          index: state.index + 1,
          routes: [
            ...state.routes,
            {
              key: `${action.payload.name}-${shortid()}`,
              name: action.payload.name,
              params: action.payload.params,
            },
          ],
        };

      case 'POP':
        return state.index > 0
          ? {
              ...state,
              index: state.index - 1,
              routes: state.routes.slice(0, state.routes.length - 1),
            }
          : state;

      case 'NAVIGATE':
        if (state.names.includes(action.payload.name)) {
          // If the route already exists, navigate to that
          const index = state.routes.findIndex(
            route => route.name === action.payload.name
          );

          if (index === -1) {
            return StackRouter.reduce(state, {
              type: 'PUSH',
              payload: action.payload,
            });
          }

          return {
            ...state,
            index,
            routes: [
              ...state.routes.slice(0, index),
              action.payload.params !== undefined
                ? { ...state.routes[index], params: action.payload.params }
                : state.routes[index],
            ],
          };
        }

        return null;

      case 'GO_BACK':
        return state.index > 0
          ? StackRouter.reduce(state, { type: 'POP' })
          : state;

      case 'RESET': {
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
      }

      default:
        return state;
    }
  },

  actions: {
    push(name: string): Action {
      return { type: 'PUSH', payload: { name } };
    },
    pop(): Action {
      return { type: 'POP' };
    },
  },
};

export default function StackNavigator(props: Props) {
  // The `navigation` object contains the navigation state and some helpers (e.g. push, pop)
  // The `descriptors` object contains `navigation` objects for children routes and helper for rendering a screen
  const { navigation, descriptors } = useNavigationBuilder(StackRouter, props);

  return (
    <div style={{ position: 'relative' }}>
      {navigation.state.routes.map((route, i) => (
        <div
          key={route.key}
          style={{
            position: 'absolute',
            margin: 20,
            left: i * 20,
            top: i * 20,
            padding: 10,
            height: 480,
            width: 320,
            backgroundColor: 'white',
            borderRadius: 3,
            boxShadow:
              '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
          }}
        >
          {descriptors[route.key].render()}
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: 40,
          width: 120,
          padding: 10,
          backgroundColor: 'tomato',
          borderRadius: 3,
          boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        }}
      >
        {
          descriptors[navigation.state.routes[navigation.state.index].key]
            .options.title
        }
      </div>
    </div>
  );
}
