/* eslint-disable react-native/no-inline-styles */

import * as React from 'react';
import shortid from 'shortid';
import {
  useNavigationBuilder,
  NavigationState,
  NavigationProp,
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
  getInitialState(
    routeNames: string[],
    { initialRouteName = routeNames[0] }: { initialRouteName?: string }
  ) {
    const index = routeNames.indexOf(initialRouteName);

    return {
      index,
      routes: routeNames.slice(0, index + 1).map(name => ({
        name,
        key: `${name}-${shortid()}`,
      })),
    };
  },

  reduce(state: NavigationState, action: Action) {
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
            top: i * 10,
            padding: 10,
            backgroundColor: 'white',
            border: '1px solid black',
          }}
        >
          {descriptors[route.key].render()}
        </div>
      ))}
    </div>
  );
}
