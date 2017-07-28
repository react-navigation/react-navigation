/* @flow */

import { Component } from 'react';
import createConfigGetter from '../createConfigGetter';
import addNavigationHelpers from '../../addNavigationHelpers';
import type {
  NavigationScreenOptionsGetter,
  NavigationStackScreenOptions,
} from '../../TypeDefinition';

test('should get config for screen', () => {
  /* eslint-disable react/no-multi-comp */

  class HomeScreen extends Component {
    static navigationOptions = ({ navigation }: *) => ({
      title: `Welcome ${navigation.state.params
        ? navigation.state.params.user
        : 'anonymous'}`,
      gesturesEnabled: true,
    });

    render() {
      return null;
    }
  }

  class SettingsScreen extends Component {
    static navigationOptions = {
      title: 'Settings!!!',
      gesturesEnabled: false,
    };

    render() {
      return null;
    }
  }

  class NotificationScreen extends Component {
    static navigationOptions = ({ navigation }: *) => ({
      title: '42',
      gesturesEnabled: navigation.state.params
        ? !navigation.state.params.fullscreen
        : true,
    });

    render() {
      return null;
    }
  }

  const getScreenOptions: NavigationScreenOptionsGetter<
    NavigationStackScreenOptions,
    *
  > = createConfigGetter({
    Home: { screen: HomeScreen },
    Settings: { screen: SettingsScreen },
    Notifications: {
      screen: NotificationScreen,
      navigationOptions: {
        title: '10 new notifications',
      },
    },
  });

  const routes = [
    { key: 'A', routeName: 'Home' },
    { key: 'B', routeName: 'Home', params: { user: 'jane' } },
    { key: 'C', routeName: 'Settings' },
    { key: 'D', routeName: 'Notifications' },
    { key: 'E', routeName: 'Notifications', params: { fullscreen: true } },
  ];

  expect(
    getScreenOptions(
      addNavigationHelpers({ state: routes[0], dispatch: () => false }),
      {}
    ).title
  ).toEqual('Welcome anonymous');
  expect(
    getScreenOptions(
      addNavigationHelpers({ state: routes[1], dispatch: () => false }),
      {}
    ).title
  ).toEqual('Welcome jane');
  expect(
    getScreenOptions(
      addNavigationHelpers({ state: routes[0], dispatch: () => false }),
      {}
    ).gesturesEnabled
  ).toEqual(true);
  expect(
    getScreenOptions(
      addNavigationHelpers({ state: routes[2], dispatch: () => false }),
      {}
    ).title
  ).toEqual('Settings!!!');
  expect(
    getScreenOptions(
      addNavigationHelpers({ state: routes[2], dispatch: () => false }),
      {}
    ).gesturesEnabled
  ).toEqual(false);
  expect(
    getScreenOptions(
      addNavigationHelpers({ state: routes[3], dispatch: () => false }),
      {}
    ).title
  ).toEqual('10 new notifications');
  expect(
    getScreenOptions(
      addNavigationHelpers({ state: routes[3], dispatch: () => false }),
      {}
    ).gesturesEnabled
  ).toEqual(true);
  expect(
    getScreenOptions(
      addNavigationHelpers({ state: routes[4], dispatch: () => false }),
      {}
    ).gesturesEnabled
  ).toEqual(false);
});

test('should throw if the route does not exist', () => {
  /* eslint-disable react/no-multi-comp */

  const HomeScreen = () => null;
  HomeScreen.navigationOptions = {
    title: 'Home screen',
    gesturesEnabled: true,
  };

  const getScreenOptions = createConfigGetter({
    Home: { screen: HomeScreen },
  });

  const routes = [{ key: 'B', routeName: 'Settings' }];

  expect(() =>
    getScreenOptions(
      addNavigationHelpers({ state: routes[0], dispatch: () => false }),
      {}
    )
  ).toThrowError(
    "There is no route defined for key Settings.\nMust be one of: 'Home'"
  );
});

test('should throw if the screen is not defined under the route config', () => {
  /* eslint-disable react/no-multi-comp */

  const getScreenOptions = createConfigGetter({
    Home: {},
  });

  const routes = [{ key: 'B', routeName: 'Home' }];

  expect(() =>
    getScreenOptions(
      addNavigationHelpers({ state: routes[0], dispatch: () => false })
    )
  ).toThrowError('Route Home must define a screen or a getScreen.');
});
