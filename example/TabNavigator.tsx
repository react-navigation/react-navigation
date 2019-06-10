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

type Action = {
  type: 'JUMP_TO';
  payload: { name: string };
};

export type TabNavigationProp = NavigationProp<typeof TabRouter>;

const TabRouter = {
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
      routes: routeNames.map(name => ({
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
        return action.payload;

      case 'GO_BACK':
        return null;

      default:
        return state;
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
