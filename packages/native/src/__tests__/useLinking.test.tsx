import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  createNavigatorFactory,
  type NavigatorScreenParams,
  type ParamListBase,
  StackRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import { act, render, waitFor } from '@testing-library/react-native';
import { Linking, Text } from 'react-native';

import { NavigationContainer } from '../NavigationContainer';

beforeEach(() => {
  jest.mocked(Linking.getInitialURL).mockResolvedValue(null);
  // @ts-expect-error:  types require private fields.
  jest.mocked(Linking.addEventListener).mockReturnValue({ remove: () => {} });
});

afterEach(() => {
  jest.clearAllMocks();
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

  // @ts-expect-error:  types require private fields.
  jest.mocked(Linking.addEventListener).mockImplementation((_, callback) => {
    listener = callback;

    return { remove: () => {} };
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

test('handles URL action in the root navigator', async () => {
  type NestedParamList = {
    Home: undefined;
    Target: undefined;
  };

  type RootParamList = {
    Nested: NavigatorScreenParams<NestedParamList>;
    Target: undefined;
  };

  const RootStack = createStackNavigator<RootParamList>();
  const NestedStack = createStackNavigator<NestedParamList>();

  let listener: ((url: string) => void) | undefined;

  const linking = {
    subscribe: (callback: (url: string) => void) => {
      listener = callback;

      return () => {
        listener = undefined;
      };
    },
    config: {
      screens: {
        Nested: {
          screens: {
            Home: '',
            Target: 'nested-target',
          },
        },
        Target: 'target',
      },
    },
  };

  const navigation = createNavigationContainerRef<RootParamList>();

  const root = await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <RootStack.Navigator>
        <RootStack.Screen name="Nested">
          {() => (
            <NestedStack.Navigator>
              <NestedStack.Screen name="Home" component={TestScreen} />
              <NestedStack.Screen name="Target">
                {() => <Text>Nested target</Text>}
              </NestedStack.Screen>
            </NestedStack.Navigator>
          )}
        </RootStack.Screen>
        <RootStack.Screen name="Target">
          {() => <Text>Root target</Text>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Home'));

  await act(() => {
    listener?.('example://target');
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      Root target
    </Text>
  `);
});

test('handles reset action in the root navigator', async () => {
  type NestedParamList = {
    Home: undefined;
    Target: undefined;
  };

  type RootParamList = {
    Nested: NavigatorScreenParams<NestedParamList>;
    Target: undefined;
  };

  const RootStack = createStackNavigator<RootParamList>();
  const NestedStack = createStackNavigator<NestedParamList>();

  let listener: ((url: string) => void) | undefined;

  const linking = {
    subscribe: (callback: (url: string) => void) => {
      listener = callback;

      return () => {
        listener = undefined;
      };
    },
    config: {
      screens: {
        Nested: {
          screens: {
            Home: '',
            Target: 'nested-target',
          },
        },
        Target: 'target',
      },
    },
    getActionFromState: () => undefined,
  };

  const navigation = createNavigationContainerRef<RootParamList>();

  const root = await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <RootStack.Navigator>
        <RootStack.Screen name="Nested">
          {() => (
            <NestedStack.Navigator>
              <NestedStack.Screen name="Home" component={TestScreen} />
              <NestedStack.Screen name="Target">
                {() => <Text>Nested target</Text>}
              </NestedStack.Screen>
            </NestedStack.Navigator>
          )}
        </RootStack.Screen>
        <RootStack.Screen name="Target">
          {() => <Text>Root target</Text>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Home'));

  await act(() => {
    listener?.('example://target');
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      Root target
    </Text>
  `);
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
