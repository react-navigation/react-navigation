import {
  createNavigationContainerRef,
  createNavigatorFactory,
  type ParamListBase,
  StackRouter,
  TabRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import { act, render, waitFor } from '@testing-library/react-native';
import * as React from 'react';

import { window } from '../__stubs__/window';
import { createStaticNavigation } from '../createStaticNavigation';

Object.assign(global, window);

// We want to use the web version of useLinking
// eslint-disable-next-line import/extensions
jest.mock('../useLinking', () => require('../useLinking.tsx'));

it('integrates with the history API', async () => {
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

  const TestScreen = ({ route }: any): any =>
    `${route.name} ${JSON.stringify(route.params)}`;

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

  render(
    <Navigation
      ref={navigation}
      linking={{
        prefixes: [],
      }}
    />
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
