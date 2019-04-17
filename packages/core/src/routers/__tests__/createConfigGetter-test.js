import { Component } from 'react';
import createConfigGetter from '../createConfigGetter';

const dummyEventSubscriber = () => ({
  remove: () => {},
});

it('should get config for screen', () => {
  class HomeScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
      title: `Welcome ${
        navigation.state.params ? navigation.state.params.user : 'anonymous'
      }`,
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
    static navigationOptions = ({ navigation }) => ({
      title: '42',
      gesturesEnabled: navigation.state.params
        ? !navigation.state.params.fullscreen
        : true,
    });

    render() {
      return null;
    }
  }

  const getScreenOptions = createConfigGetter({
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
      {
        state: routes[0],
        dispatch: () => false,
        addListener: dummyEventSubscriber,
      },
      {}
    ).title
  ).toEqual('Welcome anonymous');
  expect(
    getScreenOptions(
      {
        state: routes[1],
        dispatch: () => false,
        addListener: dummyEventSubscriber,
      },
      {}
    ).title
  ).toEqual('Welcome jane');
  expect(
    getScreenOptions(
      {
        state: routes[0],
        dispatch: () => false,
        addListener: dummyEventSubscriber,
      },
      {}
    ).gesturesEnabled
  ).toEqual(true);
  expect(
    getScreenOptions(
      {
        state: routes[2],
        dispatch: () => false,
        addListener: dummyEventSubscriber,
      },
      {}
    ).title
  ).toEqual('Settings!!!');
  expect(
    getScreenOptions(
      {
        state: routes[2],
        dispatch: () => false,
        addListener: dummyEventSubscriber,
      },
      {}
    ).gesturesEnabled
  ).toEqual(false);
  expect(
    getScreenOptions(
      {
        state: routes[3],
        dispatch: () => false,
        addListener: dummyEventSubscriber,
      },
      {}
    ).title
  ).toEqual('10 new notifications');
  expect(
    getScreenOptions(
      {
        state: routes[3],
        dispatch: () => false,
        addListener: dummyEventSubscriber,
      },
      {}
    ).gesturesEnabled
  ).toEqual(true);
  expect(
    getScreenOptions(
      {
        state: routes[4],
        dispatch: () => false,
        addListener: dummyEventSubscriber,
      },
      {}
    ).gesturesEnabled
  ).toEqual(false);
});

it('should throw if the route does not exist', () => {
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
      {
        state: routes[0],
        dispatch: () => false,
        addListener: dummyEventSubscriber,
      },
      {}
    )
  ).toThrowError(
    "There is no route defined for key Settings.\nMust be one of: 'Home'"
  );
});
