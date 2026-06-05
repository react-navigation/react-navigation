import { expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  createNavigatorFactory,
  type ParamListBase,
  StackRouter,
  TabRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import { act, render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { window } from '../__stubs__/window';
import { createStaticNavigation } from '../createStaticNavigation';

Object.assign(global, window);

// We want to use the web version of useLinking
// eslint-disable-next-line import-x/extensions
jest.mock('../useLinking', () => require('../useLinking.tsx'));

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
            {descriptors[route.key].render()}
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
            {descriptors[route.key].render()}
          </div>
        ))}
      </NavigationContent>
    );
  });

  const TestScreen = ({ route }: any): any => (
    <Text>
      {route.name} {JSON.stringify(route.params)}
    </Text>
  );

  const Stack = createStackNavigator({
    initialRouteName: 'Feed',
    screens: {
      Profile: {
        screen: TestScreen,
        linking: ':user',
      },
      Settings: {
        screen: TestScreen,
        linking: 'edit',
      },
      Updates: {
        screen: TestScreen,
        linking: 'updates',
      },
      Feed: {
        screen: TestScreen,
        linking: 'feed',
      },
    },
  });

  const Tab = createTabNavigator({
    screens: {
      Home: Stack,
      Chat: {
        screen: TestScreen,
        linking: 'chat',
      },
    },
  });

  const Navigation = createStaticNavigation(Tab);

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <Navigation
      ref={navigation}
      linking={{
        enabled: true,
      }}
    />
  );

  expect(window.location.pathname).toBe('/feed');

  await act(() => navigation.current?.navigate('Profile', { user: 'jane' }));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  await act(() => navigation.current?.navigate('Updates'));

  await waitFor(() => expect(window.location.pathname).toBe('/updates'));

  await act(() => navigation.current?.goBack());

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  await act(() => {
    window.history.back();
  });

  await waitFor(() => expect(window.location.pathname).toBe('/feed'));

  await act(() => {
    window.history.forward();
  });

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  await act(() => navigation.current?.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/edit'));

  await act(() => {
    window.history.go(-2);
  });

  await waitFor(() => expect(window.location.pathname).toBe('/feed'));

  await act(() => navigation.current?.navigate('Settings'));
  await act(() => navigation.current?.navigate('Chat'));

  await waitFor(() => expect(window.location.pathname).toBe('/chat'));

  await act(() => navigation.current?.navigate('Home'));

  await waitFor(() => expect(window.location.pathname).toBe('/edit'));
});

test("throws if linking is enabled but there's no linking configuration", async () => {
  const createTestNavigator = createNavigatorFactory(() => null);

  const TestScreen = () => null;

  const Stack = createTestNavigator({
    initialRouteName: 'Feed',
    screens: {
      Profile: {
        screen: TestScreen,
      },
      Settings: {
        screen: TestScreen,
      },
      Updates: {
        screen: TestScreen,
      },
      Feed: {
        screen: TestScreen,
      },
    },
  });

  const Tab = createTestNavigator({
    screens: {
      Home: Stack,
      Chat: {
        screen: TestScreen,
      },
    },
  });

  const Navigation = createStaticNavigation(Tab);

  await expect(
    render(<Navigation linking={{ enabled: true }} />)
  ).rejects.toThrow(
    'Linking is enabled but no linking configuration was found for the screens.'
  );

  await expect(
    render(<Navigation linking={{ enabled: false }} />)
  ).resolves.toBeDefined();

  await expect(
    render(<Navigation linking={{ enabled: 'auto' }} />)
  ).resolves.toBeDefined();
});
