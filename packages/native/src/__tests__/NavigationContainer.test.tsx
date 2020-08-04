import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  StackRouter,
  TabRouter,
  NavigationHelpersContext,
  NavigationContainerRef,
} from '@react-navigation/core';
import { act, render } from '@testing-library/react-native';
import NavigationContainer from '../NavigationContainer';
import window from '../__mocks__/window';

// @ts-expect-error: practically window is same as global, so we can ignore the error
global.window = window;

// We want to use the web version of useLinking
jest.mock('../useLinking', () => require('../useLinking.tsx').default);

it('integrates with the history API', () => {
  jest.useFakeTimers();

  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { navigation, state, descriptors } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationHelpersContext.Provider value={navigation}>
        {state.routes.map((route, i) => (
          <div key={route.key} aria-current={state.index === i || undefined}>
            {descriptors[route.key].render()}
          </div>
        ))}
      </NavigationHelpersContext.Provider>
    );
  });

  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { navigation, state, descriptors } = useNavigationBuilder(
      TabRouter,
      props
    );

    return (
      <NavigationHelpersContext.Provider value={navigation}>
        {state.routes.map((route, i) => (
          <div key={route.key} aria-current={state.index === i || undefined}>
            {descriptors[route.key].render()}
          </div>
        ))}
      </NavigationHelpersContext.Provider>
    );
  });

  const Stack = createStackNavigator();
  const Tab = createTabNavigator();

  const TestScreen = ({ route }: any): any =>
    `${route.name} ${JSON.stringify(route.params)}`;

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: {
          path: '',
          initialRouteName: 'Feed',
          screens: {
            Profile: ':user',
            Settings: 'edit',
            Updates: 'updates',
            Feed: 'feed',
          },
        },
        Chat: 'chat',
      },
    },
  };

  const navigation = React.createRef<NavigationContainerRef>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Tab.Navigator>
        <Tab.Screen name="Home">
          {() => (
            <Stack.Navigator initialRouteName="Feed">
              <Stack.Screen name="Profile" component={TestScreen} />
              <Stack.Screen name="Settings" component={TestScreen} />
              <Stack.Screen name="Feed" component={TestScreen} />
              <Stack.Screen name="Updates" component={TestScreen} />
            </Stack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="Chat" component={TestScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/feed');

  act(() => navigation.current?.navigate('Profile', { user: 'jane' }));

  expect(window.location.pathname).toBe('/jane');

  act(() => navigation.current?.navigate('Updates'));

  expect(window.location.pathname).toBe('/updates');

  act(() => navigation.current?.goBack());

  jest.runAllTimers();

  expect(window.location.pathname).toBe('/jane');

  act(() => {
    window.history.back();
    jest.runAllTimers();
  });

  expect(window.location.pathname).toBe('/feed');

  act(() => {
    window.history.forward();
    jest.runAllTimers();
  });

  expect(window.location.pathname).toBe('/jane');

  act(() => navigation.current?.navigate('Settings'));

  expect(window.location.pathname).toBe('/edit');

  act(() => {
    window.history.go(-2);
    jest.runAllTimers();
  });

  expect(window.location.pathname).toBe('/feed');

  act(() => navigation.current?.navigate('Settings'));
  act(() => navigation.current?.navigate('Chat'));

  expect(window.location.pathname).toBe('/chat');

  act(() => navigation.current?.navigate('Home'));

  expect(window.location.pathname).toBe('/edit');
});
