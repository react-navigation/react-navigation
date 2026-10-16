import '@testing-library/jest-dom/jest-globals';

import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  createNavigatorFactory,
  type ParamListBase,
  StackRouter,
  TabRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import { act, render, waitFor } from '@testing-library/react';
import { StrictMode, useEffect, useRef } from 'react';
import { Text } from 'react-native';

import { NavigationContainer } from '../NavigationContainer';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test.each([false, true])(
  'preserves a mount-time replace in a delayed navigator (StrictMode: %s)',
  (strictMode) => {
    const createStackNavigator = createNavigatorFactory((props: any) => {
      const { state, descriptors, render } = useNavigationBuilder(
        StackRouter,
        props
      );

      const route = state.routes[state.index];

      return render(route ? descriptors[route.key]?.render() : null);
    });

    const Stack = createStackNavigator();
    const navigation = createNavigationContainerRef<ParamListBase>();

    const FooScreen = ({ navigation }: any): any => {
      const hasReplaced = useRef(false);

      useEffect(() => {
        if (!hasReplaced.current) {
          hasReplaced.current = true;
          navigation.replace('bar');
        }
      }, [navigation]);

      return <Text>[foo]</Text>;
    };

    const BarScreen = (): any => <Text>[bar]</Text>;

    const Test = ({ ready }: { ready: boolean }) => (
      <NavigationContainer ref={navigation}>
        {ready ? (
          <Stack.Navigator>
            <Stack.Screen name="foo" component={FooScreen} />
            <Stack.Screen name="bar" component={BarScreen} />
          </Stack.Navigator>
        ) : null}
      </NavigationContainer>
    );

    const element = (ready: boolean) =>
      strictMode ? (
        <StrictMode>
          <Test ready={ready} />
        </StrictMode>
      ) : (
        <Test ready={ready} />
      );

    const root = render(element(false));

    root.rerender(element(true));

    expect(navigation.getCurrentRoute()?.name).toBe('bar');
    expect(root.getByText('[bar]')).toBeInTheDocument();
    expect(root.queryByText('[foo]')).not.toBeInTheDocument();
  }
);

test('integrates with the history API', async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route, i) => (
        <div key={route.key} aria-current={state.index === i || undefined}>
          {descriptors[route.key]?.render()}
        </div>
      ))
    );
  });

  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      TabRouter,
      props
    );

    return render(
      state.routes.map((route, i) => (
        <div key={route.key} aria-current={state.index === i || undefined}>
          {descriptors[route.key]?.render()}
        </div>
      ))
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
