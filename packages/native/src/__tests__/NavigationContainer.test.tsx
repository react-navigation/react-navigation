import { expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  createNavigatorFactory,
  type NavigationState,
  type ParamListBase,
  StackRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import { act, render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { NavigationContainer } from '../NavigationContainer';

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

  const { promise, resolve } = Promise.withResolvers<string | undefined>();

  await render(
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

  expect(screen.getByText('Loading')).toBeOnTheScreen();
  expect(screen.queryByText('Home')).not.toBeOnTheScreen();

  await act(() => {
    resolve(
      JSON.stringify({
        routes: [{ name: 'Profile', params: { user: 'jane' } }],
      })
    );
  });

  expect(screen.getByText('Profile{"user":"jane"}')).toBeOnTheScreen();
  expect(screen.queryByText('Loading')).not.toBeOnTheScreen();

  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Profile',
    params: { user: 'jane' },
  });
});

test('restores state with a custom parser', async () => {
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

  const parse = jest.fn((state: string | undefined) =>
    state === 'profile:jane'
      ? {
          routes: [{ name: 'Profile', params: { user: 'jane' } }],
        }
      : undefined
  );

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer
      ref={navigation}
      persistor={{
        persist() {},
        restore: () => 'profile:jane',
        parse,
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(parse).toHaveBeenCalledWith('profile:jane');
  expect(screen.getByText('Profile{"user":"jane"}')).toBeOnTheScreen();
  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Profile',
    params: { user: 'jane' },
  });
});

test('persists state from a custom stringifier', async () => {
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

  const TestScreen = ({ route }: any): any => <Text>{route.name}</Text>;

  const persist = jest.fn<(state: string | undefined) => void>();
  const stringify = jest.fn((state: NavigationState | undefined) =>
    state ? 'serialized-state' : undefined
  );

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer
      ref={navigation}
      persistor={{
        persist,
        restore: () => undefined,
        stringify,
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.current?.navigate('Profile'));

  await waitFor(() => {
    expect(persist).toHaveBeenLastCalledWith('serialized-state');
  });

  expect(stringify).toHaveBeenLastCalledWith(navigation.getRootState());
  expect(screen.getByText('Profile')).toBeOnTheScreen();
});

test('renders navigation tree immediately when state is restored synchronously', async () => {
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

  await render(
    <NavigationContainer
      ref={navigation}
      fallback={<Text>Loading</Text>}
      persistor={{
        persist() {},
        restore: () =>
          JSON.stringify({
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

  expect(screen.getByText('Profile{"user":"jane"}')).toBeOnTheScreen();
  expect(screen.queryByText('Loading')).not.toBeOnTheScreen();

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

  await render(
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

  expect(screen.getByText('Home')).toBeOnTheScreen();

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

  await render(
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
    expect(screen.getByText('Home')).toBeOnTheScreen();
    expect(navigation.getCurrentRoute()?.name).toBe('Home');
  });

  expect(spy).toHaveBeenCalledWith(
    'Failed to restore navigation state. The state will be initialized based on the navigation tree.',
    expect.any(Error)
  );
});
