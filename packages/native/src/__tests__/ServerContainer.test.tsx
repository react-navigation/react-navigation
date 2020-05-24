import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  StackRouter,
  NavigationHelpersContext,
} from '@react-navigation/core';
import { render } from 'react-native-testing-library';
import NavigationContainer from '../NavigationContainer';
import ServerContainer from '../ServerContainer';

// @ts-ignore
global.window = global;

window.addEventListener = () => {};
window.removeEventListener = () => {};

// We want to use the web version of useLinking
jest.mock('../useLinking', () => require('../useLinking.tsx').default);

it('renders correct state with location from ServerContainer', () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { navigation, state, descriptors } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationHelpersContext.Provider value={navigation}>
        {state.routes.map((route) => (
          <div key={route.key}>{descriptors[route.key].render()}</div>
        ))}
      </NavigationHelpersContext.Provider>
    );
  });

  const Stack = createStackNavigator();

  const TestScreen = ({ route }: any): any =>
    `${route.name} ${JSON.stringify(route.params)}`;

  const NestedStack = () => {
    return (
      <Stack.Navigator initialRouteName="Feed">
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
        <Stack.Screen name="Feed" component={TestScreen} />
        <Stack.Screen name="Updates" component={TestScreen} />
      </Stack.Navigator>
    );
  };

  const element = (
    <NavigationContainer
      linking={{
        prefixes: [],
        config: {
          Home: {
            initialRouteName: 'Profile',
            screens: {
              Settings: {
                path: ':user/edit',
              },
              Updates: {
                path: ':user/updates',
              },
            },
          },
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={NestedStack} />
        <Stack.Screen name="Chat" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  // @ts-ignore
  window.location = { pathname: '/jane/edit', search: '' };

  const client = render(element);

  expect(client).toMatchInlineSnapshot(`
    <div>
      <div>
        Profile undefined
      </div>
      <div>
        Settings {"user":"jane"}
      </div>
    </div>
  `);

  client?.unmount();

  const server = render(
    <ServerContainer location={{ pathname: '/john/updates', search: '' }}>
      {element}
    </ServerContainer>
  );

  expect(server).toMatchInlineSnapshot(`
    <div>
      <div>
        Profile undefined
      </div>
      <div>
        Updates {"user":"john"}
      </div>
    </div>
  `);

  server?.unmount();
});
