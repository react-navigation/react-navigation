import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  createNavigatorFactory,
  type ParamListBase,
  StackRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import { act, render, waitFor } from '@testing-library/react-native';
import { type EmitterSubscription, Linking, Text } from 'react-native';

import { NavigationContainer } from '../NavigationContainer';

beforeEach(() => {
  jest.mocked(Linking.getInitialURL).mockResolvedValue(null);
  jest
    .mocked(Linking.addEventListener)
    .mockReturnValue({ remove: () => {} } as EmitterSubscription);
});

afterEach(() => {
  jest.restoreAllMocks();
});

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

const TestScreen = ({ route }: any): any => (
  <Text>
    {route.name}
    {JSON.stringify(route.params)}
  </Text>
);

test('handles Linking initial URL', async () => {
  const Stack = createStackNavigator();

  const { promise, resolve } = Promise.withResolvers<string | null>();

  jest.mocked(Linking.getInitialURL).mockImplementation(() => promise);

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <NavigationContainer
      ref={navigation}
      linking={{
        config: {
          screens: {
            Home: '',
            Profile: 'profile/:user',
          },
        },
      }}
      fallback={<Text>Loading</Text>}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(Linking.getInitialURL).toHaveBeenCalledTimes(1);

  expect(root).toMatchInlineSnapshot(`
    <Text>
      Loading
    </Text>
  `);

  await act(() => {
    resolve('example://profile/jane');
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      Profile
      {"user":"jane"}
    </Text>
  `);

  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Profile',
    params: { user: 'jane' },
  });
});

test('handles Linking URL events', async () => {
  const Stack = createStackNavigator();

  let listener: ((event: { url: string }) => void) | undefined;

  jest.mocked(Linking.addEventListener).mockImplementation((_, callback) => {
    listener = callback;

    return { remove: () => {} } as EmitterSubscription;
  });

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer
      ref={navigation}
      linking={{
        config: {
          screens: {
            Home: '',
            Profile: 'profile/:user',
          },
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Home'));

  await act(() => {
    listener?.({ url: 'example://profile/jane' });
  });

  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Profile',
    params: { user: 'jane' },
  });
});

test('handles custom initial URL', async () => {
  const Stack = createStackNavigator();

  const { promise, resolve } = Promise.withResolvers<string | null>();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <NavigationContainer
      ref={navigation}
      linking={{
        getInitialURL: () => promise,
        config: {
          screens: {
            Home: '',
            Profile: 'profile/:user',
          },
        },
      }}
      fallback={<Text>Loading</Text>}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      Loading
    </Text>
  `);

  await act(() => {
    resolve('example://profile/jane');
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      Profile
      {"user":"jane"}
    </Text>
  `);

  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Profile',
    params: { user: 'jane' },
  });
});

test('handles custom subscribe', async () => {
  const Stack = createStackNavigator();

  let listener: ((url: string) => void) | undefined;

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer
      ref={navigation}
      linking={{
        subscribe: (callback) => {
          listener = callback;

          return () => {
            listener = undefined;
          };
        },
        config: {
          screens: {
            Home: '',
            Profile: 'profile/:user',
          },
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Home'));

  await act(() => {
    listener?.('example://profile/jane');
  });

  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Profile',
    params: { user: 'jane' },
  });
});

test("doesn't show fallback for synchronous initial URL", async () => {
  const Stack = createStackNavigator();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <NavigationContainer
      ref={navigation}
      linking={{
        getInitialURL: () => 'example://profile/jane',
        config: {
          screens: {
            Home: '',
            Profile: 'profile/:user',
          },
        },
      }}
      fallback={<Text>Loading</Text>}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      Profile
      {"user":"jane"}
    </Text>
  `);

  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Profile',
    params: { user: 'jane' },
  });
});
