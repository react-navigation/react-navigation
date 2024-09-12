/* eslint-disable @typescript-eslint/ban-ts-comment */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStaticNavigation,
  type NavigationContainerRef,
  type NavigationProp,
  type NavigatorScreenParams,
  type StaticParamList,
  type StaticScreenProps,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { expectTypeOf } from 'expect-type';

const NativeStack = createNativeStackNavigator({
  groups: {
    GroupA: {
      screenLayout: ({ navigation, children }) => {
        expectTypeOf(navigation.getState().type).toMatchTypeOf<'stack'>();
        expectTypeOf(navigation.push).toMatchTypeOf<Function>();

        return <>{children}</>;
      },
      screens: {
        Foo: {
          screen: () => <></>,
          options: { presentation: 'modal' },
        },
      },
    },
  },
});

createStaticNavigation(NativeStack);

expectTypeOf<StaticParamList<typeof NativeStack>>().toMatchTypeOf<{
  Foo: undefined;
}>();

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
    // TypeScript has a limit of 24 items in mapped types
    // So we add more items to make sure we don't hit the issue
    A: () => null,
    B: () => null,
    C: () => null,
    D: () => null,
    E: () => null,
    F: () => null,
    G: () => null,
    H: () => null,
    I: () => null,
    J: () => null,
    K: () => null,
    L: () => null,
    M: () => null,
    N: () => null,
    O: () => null,
    P: () => null,
    Q: () => null,
    R: () => null,
    S: () => null,
    T: () => null,
    U: () => null,
    V: () => null,
    W: () => null,
    X: () => null,
    Y: () => null,
    Z: () => null,
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
  screenOptions: {
    animationTypeForReplace: 'pop',
  },
});

const Navigation = createStaticNavigation(RootStack);

<Navigation />;

type RootParamList = StaticParamList<typeof RootStack>;

declare let navigation: NavigationProp<RootParamList>;

/**
 * Infer param list from navigator
 */
expectTypeOf<RootParamList>().toMatchTypeOf<{
  Home:
    | NavigatorScreenParams<{
        Groups: undefined;
        Chat: { id: number };
      }>
    | undefined;
  Profile: { user: string };
  Feed: { sort: 'hot' | 'recent' };
  Settings: undefined;
  Login: undefined;
  Register: { method: 'email' | 'social' };
  Account: undefined;
  A: undefined;
  B: undefined;
  C: undefined;
  D: undefined;
  E: undefined;
  F: undefined;
  G: undefined;
  H: undefined;
  I: undefined;
  J: undefined;
  K: undefined;
  L: undefined;
  M: undefined;
  N: undefined;
  O: undefined;
  P: undefined;
  Q: undefined;
  R: undefined;
  S: undefined;
  T: undefined;
  U: undefined;
  V: undefined;
  W: undefined;
  X: undefined;
  Y: undefined;
  Z: undefined;
}>();

/**
 * Infer screen names from config
 */
expectTypeOf(navigation.getState().routes[0].name).toEqualTypeOf<
  | 'Home'
  | 'Profile'
  | 'Feed'
  | 'Settings'
  | 'Login'
  | 'Register'
  | 'Account'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
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
navigation.navigate('Home'); // Navigate to screen without specifying a child screen
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

createBottomTabNavigator({
  screenOptions: () => ({
    tabBarActiveTintColor: 'tomato',
  }),
  screens: {},
});

createBottomTabNavigator({
  // @ts-expect-error
  screenOptions: () => ({
    tabBarActiveTintColor: 42,
  }),
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
      screen: () => null,
      options: () => ({
        tabBarActiveTintColor: 'tomato',
      }),
    },
  },
});

createBottomTabNavigator({
  screens: {
    Test: {
      screen: () => null,
      // @ts-expect-error
      options: () => ({
        tabBarActiveTintColor: 42,
      }),
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
 * Have correct type for screen options callback
 */
createBottomTabNavigator({
  screenOptions: ({ route, navigation, theme }) => {
    expectTypeOf(route.name).toMatchTypeOf<string>();
    expectTypeOf(navigation.getState().type).toMatchTypeOf<'tab'>();
    expectTypeOf(navigation.jumpTo).toMatchTypeOf<Function>();
    expectTypeOf(theme).toMatchTypeOf<ReactNavigation.Theme>();

    return {};
  },
  screens: {},
});

createBottomTabNavigator({
  screens: {
    Test: {
      screen: () => null,
      options: ({ route, navigation, theme }) => {
        expectTypeOf(route.name).toMatchTypeOf<string>();
        expectTypeOf(navigation.getState().type).toMatchTypeOf<'tab'>();
        expectTypeOf(navigation.jumpTo).toMatchTypeOf<Function>();
        expectTypeOf(theme).toMatchTypeOf<ReactNavigation.Theme>();

        return {};
      },
    },
  },
});

/**
 * Have correct type for listeners callback
 */
createBottomTabNavigator({
  screenListeners: ({ route, navigation }) => {
    expectTypeOf(route.name).toMatchTypeOf<string>();
    expectTypeOf(navigation.getState().type).toMatchTypeOf<'tab'>();
    expectTypeOf(navigation.jumpTo).toMatchTypeOf<Function>();

    return {};
  },
  screens: {},
});

createBottomTabNavigator({
  screens: {
    Test: {
      screen: () => null,
      listeners: ({ navigation, route }) => {
        expectTypeOf(route.name).toMatchTypeOf<string>();
        expectTypeOf(navigation.getState().type).toMatchTypeOf<'tab'>();
        expectTypeOf(navigation.jumpTo).toMatchTypeOf<Function>();

        return {};
      },
    },
  },
});

/**
 * Requires `screens` or `groups` to be defined
 */
// @ts-expect-error
createStackNavigator({});

createStackNavigator({
  screens: {},
});

createStackNavigator({
  groups: {},
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

/**
 * Check for errors on getCurrentRoute
 */
declare const navigationRef: NavigationContainerRef<RootParamList>;
const route = navigationRef.getCurrentRoute()!;

switch (route.name) {
  case 'Profile':
    expectTypeOf(route.params).toMatchTypeOf<{
      user: string;
    }>();
    break;
  case 'Feed':
    expectTypeOf(route.params).toMatchTypeOf<{
      sort: 'hot' | 'recent';
    }>();
    break;
  case 'Settings':
    expectTypeOf(route.params).toMatchTypeOf<undefined>();
    break;
  case 'Login':
    expectTypeOf(route.params).toMatchTypeOf<undefined>();
    break;
  case 'Register':
    expectTypeOf(route.params).toMatchTypeOf<{
      method: 'email' | 'social';
    }>();
    break;
  case 'Account':
    expectTypeOf(route.params).toMatchTypeOf<undefined>();
    break;
  // Checks for nested routes
  case 'Groups':
    expectTypeOf(route.params).toMatchTypeOf<undefined>();
    break;
  case 'Chat':
    expectTypeOf(route.params).toMatchTypeOf<{
      id: number;
    }>();
    break;
}
