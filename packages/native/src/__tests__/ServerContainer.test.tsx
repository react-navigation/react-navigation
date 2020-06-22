import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  StackRouter,
  TabRouter,
  NavigationHelpersContext,
} from '@react-navigation/core';
import { renderToString } from 'react-dom/server';
import NavigationContainer from '../NavigationContainer';
import ServerContainer from '../ServerContainer';
import type { ServerContainerRef } from '../types';

// @ts-ignore
global.window = global;

window.addEventListener = () => {};
window.removeEventListener = () => {};

// We want to use the web version of useLinking
jest.mock('../useLinking', () => require('../useLinking.tsx').default);

it('renders correct state with location', () => {
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
          screens: {
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

  const client = renderToString(element);

  expect(client).toMatchInlineSnapshot(
    `"<div><div>Profile undefined</div><div>Settings {&quot;user&quot;:&quot;jane&quot;}</div></div>"`
  );

  const server = renderToString(
    <ServerContainer location={{ pathname: '/john/updates', search: '' }}>
      {element}
    </ServerContainer>
  );

  expect(server).toMatchInlineSnapshot(
    `"<div><div>Profile undefined</div><div>Updates {&quot;user&quot;:&quot;john&quot;}</div></div>"`
  );
});

it('gets the current options', () => {
  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { navigation, state, descriptors } = useNavigationBuilder(
      TabRouter,
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

  const Tab = createTabNavigator();

  const TestScreen = ({ route }: any): any =>
    `${route.name} ${JSON.stringify(route.params)}`;

  const NestedStack = () => {
    return (
      <Tab.Navigator initialRouteName="Feed">
        <Tab.Screen
          name="Profile"
          component={TestScreen}
          options={{ title: 'My profile' }}
        />
        <Tab.Screen
          name="Settings"
          component={TestScreen}
          options={{ title: 'Configure' }}
        />
        <Tab.Screen
          name="Feed"
          component={TestScreen}
          options={{ title: 'News feed' }}
        />
        <Tab.Screen
          name="Updates"
          component={TestScreen}
          options={{ title: 'Updates from cloud', description: 'Woah' }}
        />
      </Tab.Navigator>
    );
  };

  const ref = React.createRef<ServerContainerRef>();

  renderToString(
    <ServerContainer ref={ref}>
      <NavigationContainer
        initialState={{
          routes: [
            {
              name: 'Others',
              state: {
                routes: [{ name: 'Updates' }],
              },
            },
          ],
        }}
      >
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={TestScreen}
            options={{ title: 'My app' }}
          />
          <Tab.Screen
            name="Others"
            component={NestedStack}
            options={{ title: 'Other stuff' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(ref.current?.getCurrentOptions()).toEqual({
    title: 'Updates from cloud',
    description: 'Woah',
  });
});
