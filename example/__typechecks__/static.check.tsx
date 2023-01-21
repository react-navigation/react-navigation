import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type {
  NavigationProp,
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
    },
    Settings: () => null,
  },
});

type ParamList = StaticParamList<typeof RootStack>;

declare const navigation: NavigationProp<ParamList>;

/**
 * Infer screen names from config
 */
expectTypeOf(navigation.getState().routes[0].name).toEqualTypeOf<
  'Home' | 'Profile' | 'Feed' | 'Settings'
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
