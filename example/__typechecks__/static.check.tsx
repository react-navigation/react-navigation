/* eslint-disable @typescript-eslint/ban-ts-comment */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type {
  NavigationProp,
  NavigatorScreenParams,
  StaticParamList,
  StaticScreenProps,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { expectTypeOf } from 'expect-type';

const HomeTabs = createBottomTabNavigator({
  screens: {
    Groups: () => null,
    Chat: (_: StaticScreenProps<{ id: number }>) => null,
  },
});

const RootStack = createStackNavigator({
  screens: {
    Home: HomeTabs,
    Profile: (_: StaticScreenProps<{ user: string }>) => null,
    Feed: {
      screen: (_: StaticScreenProps<{ sort: 'hot' | 'recent' }>) => null,
      options: {
        headerTitle: 'My Feed',
      },
      linking: {
        path: 'feed/:sort',
        parse: {
          sort: String,
        },
      },
      initialParams: {
        sort: 'hot',
      },
      listeners: {
        transitionEnd: (e) => {
          expectTypeOf(e.data).toMatchTypeOf<{ closing: boolean }>();
        },
      },
    },
    Settings: () => null,
  },
  groups: {
    Guest: {
      screens: {
        Login: () => null,
        Register: (_: StaticScreenProps<{ method: 'email' | 'social' }>) =>
          null,
      },
    },
    User: {
      screens: {
        Account: () => null,
      },
    },
  },
});

type RootParamList = StaticParamList<typeof RootStack>;

declare let navigation: NavigationProp<RootParamList>;

/**
 * Infer screen names from config
 */
expectTypeOf(navigation.getState().routes[0].name).toEqualTypeOf<
  'Home' | 'Profile' | 'Feed' | 'Settings' | 'Login' | 'Register' | 'Account'
>();

/**
 * Infer params from component props
 */
navigation.navigate('Profile', { user: '123' });

// @ts-expect-error
navigation.navigate('Profile');

// @ts-expect-error
navigation.navigate('Profile', { user: 123 });

// @ts-expect-error
navigation.navigate('Profile', { nonexistent: 'test' });

/**
 * Infer params from component props for config object
 */
navigation.navigate('Feed', { sort: 'hot' });
navigation.navigate('Feed', { sort: 'recent' });

// @ts-expect-error
navigation.navigate('Feed');

// @ts-expect-error
navigation.navigate('Feed', { sort: '42' });

// @ts-expect-error
navigation.navigate('Feed', { nonexistent: 'test' });

/**
 * Infer params for component without props
 */
navigation.navigate('Settings');
navigation.navigate('Settings', undefined);

// @ts-expect-error
navigation.navigate('Settings', { nonexistent: 'test' });

/**
 * Infer params from component props for inside group
 */
navigation.navigate('Register', { method: 'email' });

// @ts-expect-error
navigation.navigate('Register', { method: 'token' });

/**
 * Infer params from nested navigator
 */
navigation.navigate('Home', { screen: 'Groups' });
navigation.navigate('Home', { screen: 'Chat', params: { id: 123 } });

// @ts-expect-error
navigation.navigate('Home', { screen: 'Groups', params: { id: '123' } });

// @ts-expect-error
navigation.navigate('Home', { screen: 'Chat' });

/**
 * Infer navigator config options
 */
createBottomTabNavigator({
  backBehavior: 'initialRoute',
  screenOptions: {
    tabBarActiveTintColor: 'tomato',
  },
  screens: {},
});

createBottomTabNavigator({
  // @ts-expect-error
  backBehavior: 'unsupported',
  screens: {},
});

createBottomTabNavigator({
  screenOptions: {
    // @ts-expect-error
    tabBarActiveTintColor: 42,
  },
  screens: {},
});

/**
 * Infer screen  options
 */
createBottomTabNavigator({
  screens: {
    Test: {
      screen: () => null,
      options: {
        tabBarActiveTintColor: 'tomato',
      },
    },
  },
});

createBottomTabNavigator({
  screens: {
    Test: {
      screen: () => null,
      options: {
        // @ts-expect-error
        tabBarActiveTintColor: 42,
      },
    },
  },
});

createBottomTabNavigator({
  screens: {
    Test: {
      screen: (_: { foo: number }) => null,
      initialParams: {
        foo: 'test',
      },
    },
  },
});

/**
 * Requires `screens` to be defined
 */
// @ts-expect-error
createStackNavigator({});

createStackNavigator({
  screens: {},
});

/**
 * Infer types from group without screens
 */
const MyTabs = createBottomTabNavigator({
  groups: {
    Test: {
      screens: {
        Test: (_: StaticScreenProps<{ foo: string }>) => null,
      },
    },
  },
});

const MyStack = createStackNavigator({
  groups: {
    Guest: {
      screens: {
        Login: () => null,
      },
    },
    User: {
      screens: {
        Home: () => null,
        Profile: (_: StaticScreenProps<{ id: number }>) => null,
        Forum: MyTabs,
      },
    },
  },
});

type MyParamList = StaticParamList<typeof MyStack>;

expectTypeOf<MyParamList>().toMatchTypeOf<{
  Login: undefined;
  Home: undefined;
  Profile: { id: number };
  Forum:
    | NavigatorScreenParams<{
        Test: { foo: string };
      }>
    | undefined;
}>();
