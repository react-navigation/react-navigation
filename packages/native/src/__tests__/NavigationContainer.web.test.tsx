import '@testing-library/jest-dom/jest-globals';

import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  createNavigatorFactory,
  type NavigationState,
  type ParamListBase,
  type PartialState,
  StackRouter,
  TabRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Text } from 'react-native';

import { NavigationContainer } from '../NavigationContainer';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('integrates with the history API', async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route, i) => (
          <div key={route.key} aria-current={state.index === i || undefined}>
            {descriptors[route.key]?.render()}
          </div>
        ))}
      </NavigationContent>
    );
  });

  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TabRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route, i) => (
          <div key={route.key} aria-current={state.index === i || undefined}>
            {descriptors[route.key]?.render()}
          </div>
        ))}
      </NavigationContent>
    );
  });

  const Stack = createStackNavigator();
  const Tab = createTabNavigator();

  const TestScreen = ({ route }: any): any => (
    <Text>
      {route.name} {JSON.stringify(route.params)}
    </Text>
  );

  const linking = {
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

  const navigation = createNavigationContainerRef<ParamListBase>();

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

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  act(() => navigation.current?.navigate('Updates'));

  await waitFor(() => expect(window.location.pathname).toBe('/updates'));

  act(() => navigation.current?.goBack());

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  act(() => {
    window.history.back();
  });

  await waitFor(() => expect(window.location.pathname).toBe('/feed'));

  act(() => {
    window.history.forward();
  });

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  act(() => navigation.current?.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/edit'));

  act(() => {
    window.history.go(-2);
  });

  await waitFor(() => expect(window.location.pathname).toBe('/feed'));

  act(() => navigation.current?.navigate('Settings'));
  act(() => navigation.current?.navigate('Chat'));

  await waitFor(() => expect(window.location.pathname).toBe('/chat'));

  act(() => navigation.current?.navigate('Home'));

  await waitFor(() => expect(window.location.pathname).toBe('/edit'));
});

test('renders fallback before state is restored asynchronously', async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    const route = state.routes[state.index];

    return (
      <NavigationContent>
        {route ? descriptors[route.key]?.render() : null}
      </NavigationContent>
    );
  });

  const Stack = createStackNavigator();

  const TestScreen = ({ route }: any): any => (
    <Text>
      {route.name}
      {JSON.stringify(route.params)}
    </Text>
  );

  const navigation = createNavigationContainerRef<ParamListBase>();

  const { promise, resolve } =
    Promise.withResolvers<PartialState<NavigationState>>();

  render(
    <NavigationContainer
      ref={navigation}
      fallback={<Text>Loading</Text>}
      persistor={{
        persist() {},
        restore: () => promise,
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('Loading')).toBeInTheDocument();
  expect(screen.queryByText('Home')).not.toBeInTheDocument();

  await act(() => {
    resolve({
      routes: [{ name: 'Profile', params: { user: 'jane' } }],
    });
  });

  expect(screen.getByText('Profile{"user":"jane"}')).toBeInTheDocument();
  expect(screen.queryByText('Loading')).not.toBeInTheDocument();

  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Profile',
    params: { user: 'jane' },
  });
});

test('renders navigation tree immediately when state is restored synchronously', () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    const route = state.routes[state.index];

    return (
      <NavigationContent>
        {route ? descriptors[route.key]?.render() : null}
      </NavigationContent>
    );
  });

  const Stack = createStackNavigator();

  const TestScreen = ({ route }: any): any => (
    <Text>
      {route.name}
      {JSON.stringify(route.params)}
    </Text>
  );

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer
      ref={navigation}
      fallback={<Text>Loading</Text>}
      persistor={{
        persist() {},
        restore: () => ({
          routes: [{ name: 'Profile', params: { user: 'jane' } }],
        }),
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('Profile{"user":"jane"}')).toBeInTheDocument();
  expect(screen.queryByText('Loading')).not.toBeInTheDocument();

  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Profile',
    params: { user: 'jane' },
  });
});

test('renders normally when state restoration throws', async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    const route = state.routes[state.index];

    return (
      <NavigationContent>
        {route ? descriptors[route.key]?.render() : null}
      </NavigationContent>
    );
  });

  const Stack = createStackNavigator();

  const TestScreen = ({ route }: any): any => (
    <Text>
      {route.name}
      {JSON.stringify(route.params)}
    </Text>
  );

  const navigation = createNavigationContainerRef<ParamListBase>();

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <NavigationContainer
      ref={navigation}
      persistor={{
        persist() {},
        restore() {
          throw new Error('Failed');
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('Home')).toBeInTheDocument();

  await waitFor(() => {
    expect(navigation.getCurrentRoute()?.name).toBe('Home');
  });

  expect(spy).toHaveBeenCalledWith(
    'Failed to restore navigation state. The state will be initialized based on the navigation tree.',
    expect.any(Error)
  );
});

test('renders normally when state restoration rejects', async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    const route = state.routes[state.index];

    return (
      <NavigationContent>
        {route ? descriptors[route.key]?.render() : null}
      </NavigationContent>
    );
  });

  const Stack = createStackNavigator();

  const TestScreen = ({ route }: any): any => (
    <Text>
      {route.name}
      {JSON.stringify(route.params)}
    </Text>
  );

  const navigation = createNavigationContainerRef<ParamListBase>();

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <NavigationContainer
      ref={navigation}
      persistor={{
        persist() {},
        restore() {
          return Promise.reject(new Error('Failed'));
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await waitFor(() => {
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(navigation.getCurrentRoute()?.name).toBe('Home');
  });

  expect(spy).toHaveBeenCalledWith(
    'Failed to restore navigation state. The state will be initialized based on the navigation tree.',
    expect.any(Error)
  );
});
