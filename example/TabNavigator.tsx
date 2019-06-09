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

type Action = {
  type: 'JUMP_TO';
  payload: { name: string };
};

export type TabNavigationProp = NavigationProp<typeof TabRouter>;

const TabRouter = {
  getInitialState(
    routeNames: string[],
    { initialRouteName = routeNames[0] }: { initialRouteName?: string }
  ) {
    const index = routeNames.indexOf(initialRouteName);

    return {
      index,
      routes: routeNames.map(name => ({
        name,
        key: `${name}-${shortid()}`,
      })),
    };
  },

  reduce(state: NavigationState, action: Action) {
    switch (action.type) {
      case 'JUMP_TO':
        return {
          ...state,
          index: state.routes.findIndex(
            route => route.name === action.payload.name
          ),
        };
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
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {navigation.state.routes.map((route, i, self) => (
        <div
          key={route.key}
          style={{
            width: `${100 / self.length}%`,
            backgroundColor: i === navigation.state.index ? 'tomato' : 'white',
            border: '1px solid black',
          }}
        >
          {descriptors[route.key].render()}
        </div>
      ))}
    </div>
  );
}
