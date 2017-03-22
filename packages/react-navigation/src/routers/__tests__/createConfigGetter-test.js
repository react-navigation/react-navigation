/* @flow */

import { Component } from 'react';
import createConfigGetter from '../createConfigGetter';

import addNavigationHelpers from '../../addNavigationHelpers';

test('should get config for screen', () => {
  /* eslint-disable react/no-multi-comp */

  class HomeScreen extends Component {
    static navigationOptions = {
      title: ({ state }: *) => `Welcome ${state.params ? state.params.user : 'anonymous'}`,
      header: {
        visible: true,
      },
    };

    render() {
      return null;
    }
  }

  class SettingsScreen extends Component {
    static navigationOptions = {
      title: 'Settings!!!',
      permalink: '',
      header: {
        visible: false,
      },
    };

    render() {
      return null;
    }
  }

  class NotificationScreen extends Component {
    static navigationOptions = {
      title: () => '42',
      header: ({ state }: *) => ({
        visible: state.params ? !state.params.fullscreen : true,
      }),
    };

    render() {
      return null;
    }
  }

  const getScreenConfig = createConfigGetter({
    Home: { screen: HomeScreen },
    Settings: { screen: SettingsScreen },
    Notifications: {
      screen: NotificationScreen,
      navigationOptions: {
        title: () => '10 new notifications',
        count: 0,
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

  expect(getScreenConfig(addNavigationHelpers({ state: routes[0], dispatch: () => false }), 'title')).toEqual('Welcome anonymous');
  expect(getScreenConfig(addNavigationHelpers({ state: routes[1], dispatch: () => false }), 'title')).toEqual('Welcome jane');
  /* $FlowFixMe: we want tests to fail on undefined */
  expect(getScreenConfig(addNavigationHelpers({ state: routes[0], dispatch: () => false }), 'header').visible).toEqual(true);
  expect(getScreenConfig(addNavigationHelpers({ state: routes[2], dispatch: () => false }), 'title')).toEqual('Settings!!!');
  expect(getScreenConfig(addNavigationHelpers({ state: routes[2], dispatch: () => false }), 'permalink')).toEqual('');
  /* $FlowFixMe: we want tests to fail on undefined */
  expect(getScreenConfig(addNavigationHelpers({ state: routes[2], dispatch: () => false }), 'header').visible).toEqual(false);
  expect(getScreenConfig(addNavigationHelpers({ state: routes[3], dispatch: () => false }), 'title')).toEqual('10 new notifications');
  expect(getScreenConfig(addNavigationHelpers({ state: routes[3], dispatch: () => false }), 'count')).toEqual(0);
  /* $FlowFixMe: we want tests to fail on undefined */
  expect(getScreenConfig(addNavigationHelpers({ state: routes[4], dispatch: () => false }), 'header').visible).toEqual(false);
});

test('should throw if the route does not exist', () => {
  /* eslint-disable react/no-multi-comp */

  const HomeScreen = () => null;
  HomeScreen.navigationOptions = {
    title: 'Home screen',
    header: {
      visible: true,
    },
  };

  const getScreenConfig = createConfigGetter({
    Home: { screen: HomeScreen },
  });

  const routes = [
    { key: 'B', routeName: 'Settings' },
  ];

  expect(
    () => getScreenConfig({ state: routes[0], dispatch: () => false }, 'title')
  ).toThrowError("There is no route defined for key Settings.\nMust be one of: 'Home'");
});

test('should throw if the screen is not defined under the route config', () => {
  /* eslint-disable react/no-multi-comp */

  const getScreenConfig = createConfigGetter({
    Home: {},
  });

  const routes = [
    { key: 'B', routeName: 'Home' },
  ];

  expect(
    () => getScreenConfig({ state: routes[0], dispatch: () => false }, 'title')
  ).toThrowError('Route Home must define a screen or a getScreen.');
});

test('should get recursive config for screen', () => {
  class NotificationScreen extends Component {
    static router = {
      getScreenConfig: () => 'Baz',
    };
    static navigationOptions = {
      title: (navigation: *, childTitle: *) => `Bar ${childTitle}`,
    };
  }

  const getScreenConfig = createConfigGetter({
    Notifications: {
      screen: NotificationScreen,
      navigationOptions: {
        title: (navigation: *, childTitle: *) => `Foo ${childTitle}`,
      },
    },
  });

  const childNavigation = addNavigationHelpers({
    state: {
      key: 'A',
      routeName: 'Notifications',
      index: 0,
      routes: [{ key: 'A', routeName: 'Anything' }],
    },
    dispatch: () => false,
  });

  expect(getScreenConfig(childNavigation, 'title')).toEqual('Foo Bar Baz');
});

test('Allow passthrough configuration', () => {
  class NotificationScreen extends Component {
    static navigationOptions = {
      tabBar: (navigation: *, tabBar: *) => ({ deepConfig: `also ${tabBar.color}` }),
    };
  }

  const getScreenConfig = createConfigGetter({
    Notifications: {
      screen: NotificationScreen,
    },
  });

  const childNavigation = addNavigationHelpers({
    state: {
      key: 'A',
      routeName: 'Notifications',
    },
    dispatch: () => false,
  });

  expect(getScreenConfig(childNavigation, 'tabBar', { color: 'red' })).toEqual({ deepConfig: 'also red' });
});
