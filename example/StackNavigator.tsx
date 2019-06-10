/* eslint-disable react-native/no-inline-styles */

import * as React from 'react';
import shortid from 'shortid';
import {
  useNavigationBuilder,
  NavigationState,
  NavigationProp,
  CommonAction,
  InitialState,
} from '../src/index';

type Props = {
  initialRouteName?: string;
  navigation?: NavigationProp;
  children: React.ReactElement[];
};

type Action =
  | {
      type: 'PUSH';
      payload: { name: string };
    }
  | { type: 'POP' };

export type StackNavigationProp = NavigationProp<typeof StackRouter>;

const StackRouter = {
  initial({
    routeNames,
    initialRouteName = routeNames[0],
  }: {
    routeNames: string[];
    initialRouteName?: string;
  }): InitialState {
    const index = routeNames.indexOf(initialRouteName);

    return {
      index,
      routes: routeNames.slice(0, index + 1).map(name => ({
        name,
        key: `${name}-${shortid()}`,
      })),
    };
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
              name: action.payload.name,
              key: `${action.payload.name}-${shortid()}`,
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
              payload: { name: action.payload.name },
            });
          }

          return {
            ...state,
            index,
            routes: state.routes.slice(0, index + 1),
          };
        }

        return null;

      case 'GO_BACK':
        return state.index > 0
          ? StackRouter.reduce(state, { type: 'POP' })
          : state;

      case 'RESET':
        return action.payload;

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
