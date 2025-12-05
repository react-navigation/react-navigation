/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  type BottomTabNavigationProp,
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import {
  type CompositeNavigationProp,
  createStaticNavigation,
  type NavigationContainerRef,
  type NavigationListForNested,
  type NavigationProp,
  type NavigatorScreenParams,
  type StaticParamList,
  type StaticScreenProps,
  type Theme,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import {
  createStackNavigator,
  createStackScreen,
  type StackNavigationProp,
} from '@react-navigation/stack';
import { expectTypeOf } from 'expect-type';

const NativeStack = createNativeStackNavigator({
  groups: {
    GroupA: {
      screenLayout: ({ navigation, children }) => {
        expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();
        expectTypeOf(navigation.push).toExtend<() => void>();

        return <>{children}</>;
      },
      screens: {
        Foo: createNativeStackScreen({
          screen: () => <></>,
          options: { presentation: 'modal' },
        }),
      },
    },
  },
});

createStaticNavigation(NativeStack);

expectTypeOf<StaticParamList<typeof NativeStack>>().toEqualTypeOf<{
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
    Feed: createStackScreen({
      screen: (_: StaticScreenProps<{ sort: 'hot' | 'recent' }>) => null,
      options: {
        headerTitle: 'My Feed',
      },
      linking: {
        path: 'feed/:sort',
        parse: {
          sort: (value) => value as 'hot' | 'recent',
        },
      },
      initialParams: {
        sort: 'hot',
      },
      listeners: {
        transitionEnd: (e) => {
          expectTypeOf(e.data).toEqualTypeOf<Readonly<{ closing: boolean }>>();
        },
      },
    }),
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

type RooStackRouteName =
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
  | 'Z';

expectTypeOf<keyof RootParamList>().toEqualTypeOf<RooStackRouteName>();

declare let navigation: NavigationProp<RootParamList>;

/**
 * Infer param list from navigator
 */
expectTypeOf<RootParamList>().toEqualTypeOf<{
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
 * Infer navigation props from navigator
 */
expectTypeOf<NavigationListForNested<typeof RootStack>['Home']>().toEqualTypeOf<
  StackNavigationProp<RootParamList, 'Home'>
>();

expectTypeOf<NavigationListForNested<typeof RootStack>['Feed']>().toEqualTypeOf<
  StackNavigationProp<RootParamList, 'Feed'>
>();

expectTypeOf<
  NavigationListForNested<typeof RootStack>['Settings']
>().toEqualTypeOf<StackNavigationProp<RootParamList, 'Settings'>>();

expectTypeOf<NavigationListForNested<typeof RootStack>['Chat']>().toEqualTypeOf<
  CompositeNavigationProp<
    BottomTabNavigationProp<StaticParamList<typeof HomeTabs>, 'Chat'>,
    StackNavigationProp<RootParamList, 'Home'>
  >
>();

expectTypeOf<
  // @ts-expect-error
  NavigationListForNested<typeof RootStack>['Invalid']
>().toEqualTypeOf<unknown>();

expectTypeOf<keyof NavigationListForNested<typeof RootStack>>().toEqualTypeOf<
  RooStackRouteName | 'Groups' | 'Chat'
>();

/**
 * Infer screen names from config
 */
expectTypeOf(
  navigation.getState().routes[0].name
).toEqualTypeOf<RooStackRouteName>();

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
    Test: createBottomTabScreen({
      screen: () => null,
      options: {
        tabBarActiveTintColor: 'tomato',
      },
    }),
  },
});

createBottomTabNavigator({
  screens: {
    Test: createBottomTabScreen({
      screen: () => null,
      options: {
        // @ts-expect-error
        tabBarActiveTintColor: 42,
      },
    }),
  },
});

createBottomTabNavigator({
  screens: {
    Test: createBottomTabScreen({
      screen: () => null,
      options: () => ({
        tabBarActiveTintColor: 'tomato',
      }),
    }),
  },
});

createBottomTabNavigator({
  screens: {
    Test: createBottomTabScreen({
      screen: () => null,
      // @ts-expect-error
      options: () => ({
        tabBarActiveTintColor: 42,
      }),
    }),
  },
});

createBottomTabNavigator({
  screens: {
    Test: createBottomTabScreen({
      screen: (_: StaticScreenProps<{ foo: number }>) => null,
      initialParams: {
        // @ts-expect-error
        foo: 'test',
      },
    }),
  },
});

/**
 * Have correct type for screen options callback
 */
createBottomTabNavigator({
  screenOptions: ({ route, navigation, theme }) => {
    expectTypeOf(route.name).toEqualTypeOf<string>();
    expectTypeOf(navigation.getState().type).toEqualTypeOf<'tab'>();
    expectTypeOf(navigation.jumpTo).toExtend<() => void>();
    expectTypeOf(theme).toEqualTypeOf<Theme>();

    return {};
  },
  screens: {},
});

createBottomTabNavigator({
  screens: {
    Test: {
      screen: () => null,
      options: ({ route, navigation, theme }) => {
        expectTypeOf(route.name).toEqualTypeOf<string>();
        expectTypeOf(navigation.getState().type).toEqualTypeOf<'tab'>();
        expectTypeOf(navigation.jumpTo).toExtend<() => void>();
        expectTypeOf(theme).toEqualTypeOf<Theme>();

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
    expectTypeOf(route.name).toEqualTypeOf<string>();
    expectTypeOf(navigation.getState().type).toEqualTypeOf<'tab'>();
    expectTypeOf(navigation.jumpTo).toExtend<() => void>();

    return {};
  },
  screens: {},
});

createBottomTabNavigator({
  screens: {
    Test: {
      screen: () => null,
      listeners: ({ navigation, route }) => {
        expectTypeOf(route.name).toEqualTypeOf<string>();
        expectTypeOf(navigation.getState().type).toEqualTypeOf<'tab'>();
        expectTypeOf(navigation.jumpTo).toExtend<() => void>();

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

expectTypeOf<MyParamList>().toEqualTypeOf<{
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
    expectTypeOf(route.params).toEqualTypeOf<
      Readonly<{
        user: string;
      }>
    >();
    break;
  case 'Feed':
    expectTypeOf(route.params).toEqualTypeOf<
      Readonly<{
        sort: 'hot' | 'recent';
      }>
    >();
    break;
  case 'Settings':
    expectTypeOf(route.params).toEqualTypeOf<undefined>();
    break;
  case 'Login':
    expectTypeOf(route.params).toEqualTypeOf<undefined>();
    break;
  case 'Register':
    expectTypeOf(route.params).toEqualTypeOf<
      Readonly<{
        method: 'email' | 'social';
      }>
    >();
    break;
  case 'Account':
    expectTypeOf(route.params).toEqualTypeOf<undefined>();
    break;
  // Checks for nested routes
  case 'Groups':
    expectTypeOf(route.params).toEqualTypeOf<undefined>();
    break;
  case 'Chat':
    expectTypeOf(route.params).toEqualTypeOf<
      Readonly<{
        id: number;
      }>
    >();
    break;
}

/**
 * Infer types from typed screen component
 */
createStackNavigator({
  screens: {
    Profile: createStackScreen({
      screen: (
        _: StaticScreenProps<{ userId: string; filter?: 'recent' | 'popular' }>
      ) => null,
      options: ({ route, navigation }) => {
        expectTypeOf(route.name).toEqualTypeOf<string>();
        expectTypeOf(route.params).toEqualTypeOf<{
          userId: string;
          filter?: 'recent' | 'popular';
        }>();

        expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

        return {
          headerTitle: route.params.userId,
        };
      },
      listeners: ({ route, navigation }) => {
        expectTypeOf(route.params).toEqualTypeOf<{
          userId: string;
          filter?: 'recent' | 'popular';
        }>();

        expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

        return {};
      },
      layout: ({ route, navigation, children }) => {
        expectTypeOf(route.params).toEqualTypeOf<{
          userId: string;
          filter?: 'recent' | 'popular';
        }>();

        expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

        return <>{children}</>;
      },
      getId: ({ params }) => {
        expectTypeOf(params).toEqualTypeOf<{
          userId: string;
          filter?: 'recent' | 'popular';
        }>();

        return params.userId;
      },
      initialParams: {
        filter: 'recent',
        // @ts-expect-error
        userId: 3,
      },
    }),
  },
});

/**
 * Handle screen component without optional params
 */
createStackNavigator({
  screens: {
    Details: createStackScreen({
      screen: (
        _: StaticScreenProps<{ itemId: number; info: string } | undefined>
      ) => null,
      options: ({ route, navigation }) => {
        expectTypeOf(route.name).toEqualTypeOf<string>();
        expectTypeOf(route.params).toEqualTypeOf<
          | {
              itemId: number;
              info: string;
            }
          | undefined
        >();
        expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

        return {};
      },
      listeners: ({ route, navigation }) => {
        expectTypeOf(route.params).toEqualTypeOf<
          | {
              itemId: number;
              info: string;
            }
          | undefined
        >();
        expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

        return {};
      },
      layout: ({ route, navigation, children }) => {
        expectTypeOf(route.params).toEqualTypeOf<
          | {
              itemId: number;
              info: string;
            }
          | undefined
        >();
        expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

        return <>{children}</>;
      },
      getId: ({ params }) => {
        expectTypeOf(params).toEqualTypeOf<
          | {
              itemId: number;
              info: string;
            }
          | undefined
        >();

        return params?.itemId.toString();
      },
      initialParams: {
        itemId: 1,
        info: 'Item 1',
      },
    }),
  },
});

/**
 * Handle screen component without typed route prop
 */
createStackNavigator({
  screens: {
    Settings: createStackScreen({
      screen: () => null,
      options: ({ route, navigation }) => {
        expectTypeOf(route.name).toEqualTypeOf<string>();
        expectTypeOf(route.params).toEqualTypeOf<undefined>();
        expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

        return {};
      },
      listeners: ({ route, navigation }) => {
        expectTypeOf(route.params).toEqualTypeOf<undefined>();
        expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

        return {};
      },
      layout: ({ route, navigation, children }) => {
        expectTypeOf(route.params).toEqualTypeOf<undefined>();
        expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

        return <>{children}</>;
      },
      getId: ({ params }) => {
        expectTypeOf(params).toEqualTypeOf<undefined>();

        return 'static-id';
      },
    }),
  },
});

/**
 * Handle screen which is a nested navigator
 */
createBottomTabNavigator({
  screens: {
    User: createBottomTabScreen({
      screen: createStackNavigator({
        screens: {
          Profile: (_: StaticScreenProps<{ userId: string }>) => null,
        },
      }),
      options: ({ route, navigation }) => {
        expectTypeOf(route.name).toEqualTypeOf<string>();
        expectTypeOf(route.params).toEqualTypeOf<
          | NavigatorScreenParams<{
              Profile: {
                userId: string;
              };
            }>
          | undefined
        >();

        expectTypeOf(navigation.getState().type).toEqualTypeOf<'tab'>();

        return {};
      },
      listeners: ({ route, navigation }) => {
        expectTypeOf(route.params).toEqualTypeOf<
          | NavigatorScreenParams<{
              Profile: {
                userId: string;
              };
            }>
          | undefined
        >();

        expectTypeOf(navigation.getState().type).toEqualTypeOf<'tab'>();

        return {};
      },
      layout: ({ route, navigation, children }) => {
        expectTypeOf(route.params).toEqualTypeOf<
          | NavigatorScreenParams<{
              Profile: {
                userId: string;
              };
            }>
          | undefined
        >();

        expectTypeOf(navigation.getState().type).toEqualTypeOf<'tab'>();

        return <>{children}</>;
      },
      getId: ({ params }) => {
        expectTypeOf(params).toEqualTypeOf<
          | NavigatorScreenParams<{
              Profile: {
                userId: string;
              };
            }>
          | undefined
        >();

        return 'static-id';
      },
    }),
  },
});

/**
 * Params type is `unknown` when `createXScreen` isn't used
 */
createStackNavigator({
  screens: {
    Profile: {
      screen: (_: StaticScreenProps<{ userId: string }>) => null,
      options: ({ route, navigation }) => {
        expectTypeOf(route.params).not.toBeAny();
        expectTypeOf(route.params).toBeUnknown();
        expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

        return {};
      },
      listeners: ({ route, navigation }) => {
        expectTypeOf(route.params).not.toBeAny();
        expectTypeOf(route.params).toBeUnknown();
        expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

        return {};
      },
      layout: ({ route, navigation, children }) => {
        expectTypeOf(route.params).not.toBeAny();
        expectTypeOf(route.params).toBeUnknown();
        expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

        return <>{children}</>;
      },
      getId: ({ params }) => {
        expectTypeOf(params).not.toBeAny();
        expectTypeOf(params).toBeUnknown();

        return 'static-id';
      },
    },
  },
});

/**
 * Linking config validates parse/stringify keys against params
 */
createStackNavigator({
  screens: {
    Profile: createStackScreen({
      screen: (
        _: StaticScreenProps<{
          userId: string;
          postId: number;
          commentId: number;
        }>
      ) => null,
      linking: {
        path: 'profile/:userId/:postId',
        parse: {
          userId: String,
          postId: Number,
        },
        stringify: {
          userId: String,
          postId: String,
        },
        alias: [
          ':userId/:postId',
          {
            path: 'user/:userId/:postId',
            parse: {
              userId: String,
              postId: Number,
            },
          },
        ],
      },
    }),
    Details: createStackScreen({
      screen: (_: StaticScreenProps<{ id: string }>) => null,
      linking: 'details/:id',
    }),
    Item: createStackScreen({
      screen: (_: StaticScreenProps<{ itemId: string; category: string }>) =>
        null,
      linking: {
        path: 'item/:itemId/:category',
        parse: {
          itemId: String,
        },
      },
    }),
  },
});

/**
 * Type tests for param inference from linking config
 */
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const TestNavigator = createStackNavigator({
    screens: {
      /**
       * Infer from path and parse
       */
      UserProfile: createStackScreen({
        screen: (_: StaticScreenProps<{ userId: number; postId: string }>) =>
          null,
        linking: {
          path: 'user/:userId/:postId',
          parse: {
            userId: (value: string) => Number(value),
          },
        },
        options: ({ route }) => {
          expectTypeOf(route.params).toEqualTypeOf<{
            userId: number;
            postId: string;
          }>();

          return {};
        },
      }),
      /**
       * Infer from screen props only
       */
      Settings: createStackScreen({
        screen: (_: StaticScreenProps<{ name: string; age: number }>) => null,
        options: ({ route }) => {
          expectTypeOf(route.params).toEqualTypeOf<{
            name: string;
            age: number;
          }>();

          return {};
        },
      }),
      /**
       * Infer from screen props and path without params
       */
      UserDashboard: createStackScreen({
        screen: (
          _: StaticScreenProps<{
            userId: string;
            section: 'posts' | 'comments';
          }>
        ) => null,
        linking: {
          path: 'user/dashboard',
        },
        options: ({ route }) => {
          expectTypeOf(route.params).toEqualTypeOf<{
            userId: string;
            section: 'posts' | 'comments';
          }>();

          return {};
        },
      }),
      /**
       * Infer from path with empty params
       */
      UserSettings: createStackScreen({
        screen: (_: StaticScreenProps<{}>) => null,
        linking: {
          path: 'settings/:userId',
        },
        options: ({ route }) => {
          expectTypeOf(route.params).toEqualTypeOf<{
            userId: string;
          }>();

          return {};
        },
      }),
      /**
       * Infer from path with no props
       */
      Help: createStackScreen({
        screen: () => null,
        linking: {
          path: 'help/:topic',
        },
        options: ({ route }) => {
          expectTypeOf(route.params).toEqualTypeOf<{
            topic: string;
          }>();

          return {};
        },
      }),
      /**
       * Handle optional param in path
       */
      UserList: createStackScreen({
        screen: (_: StaticScreenProps<{ userId?: number; filter: string }>) =>
          null,
        linking: {
          path: 'users/:userId?/:filter',
          parse: {
            userId: (value: string) => Number(value),
          },
        },
        options: ({ route }) => {
          expectTypeOf(route.params).toEqualTypeOf<{
            userId?: number;
            filter: string;
          }>();

          return {};
        },
      }),
      /**
       * Handle regex in path
       */
      Item: createStackScreen({
        screen: (_: StaticScreenProps<{ category: string }>) => null,
        linking: {
          path: 'item/:id([0-9]+)/:slug([a-z-]+)/:category',
        },
        options: ({ route }) => {
          expectTypeOf(route.params).toEqualTypeOf<{
            id: string;
            slug: string;
            category: string;
          }>();

          return {};
        },
      }),
      /**
       * Merge params from path and screen props
       */
      ItemDetails: createStackScreen({
        screen: (_: StaticScreenProps<{ itemId: string }>) => null,
        linking: {
          path: 'item/:itemId/:infoType',
          parse: {
            infoType: (value: string) =>
              value === 'full' ? 'full' : 'summary',
          },
        },
        options: ({ route }) => {
          expectTypeOf(route.params).toEqualTypeOf<{
            itemId: string;
            infoType: 'summary' | 'full';
          }>();

          return {};
        },
      }),
      /**
       * Merge params from path and screen props with optionality
       */
      ItemPrice: createStackScreen({
        screen: (
          _: StaticScreenProps<{ itemId: string; currency?: 'USD' | 'EUR' }>
        ) => null,
        linking: {
          path: 'item/:itemId/:currency?',
          parse: {
            currency: (value: string) => (value === 'USD' ? 'USD' : 'EUR'),
          },
        },
        options: ({ route }) => {
          expectTypeOf(route.params).toEqualTypeOf<{
            itemId: string;
            currency?: 'USD' | 'EUR';
          }>();

          return {};
        },
      }),
      /**
       * Handle string in pattern
       */
      Details: createStackScreen({
        screen: (_: StaticScreenProps<{ detailId: string }>) => null,
        linking: 'details/:detailId',
        options: ({ route }) => {
          expectTypeOf(route.params).toEqualTypeOf<{
            detailId: string;
          }>();

          return {};
        },
      }),
      /**
       * Handle component and path without params
       */
      About: createStackScreen({
        screen: () => null,
        linking: {
          path: 'about',
        },
        options: ({ route }) => {
          expectTypeOf(route.params).toEqualTypeOf<undefined>();

          return {};
        },
      }),
      /**
       * Nested navigator with params inferred from children
       */
      Dashboard: createStackScreen({
        screen: createBottomTabNavigator({
          screens: {
            Overview: (_: StaticScreenProps<{ period: string }>) => null,
            Stats: createBottomTabScreen({
              screen: (_: StaticScreenProps<{ chartType: 'bar' | 'line' }>) =>
                null,
            }),
          },
        }),
        options: ({ route }) => {
          expectTypeOf(route.params).toEqualTypeOf<
            | NavigatorScreenParams<{
                Overview: {
                  period: string;
                };
                Stats: {
                  chartType: 'bar' | 'line';
                };
              }>
            | undefined
          >();

          return {};
        },
      }),
      /**
       * Merge params from nested navigator and path
       */
      Feed: createStackScreen({
        screen: createBottomTabNavigator({
          screens: {
            Overview: (_: StaticScreenProps<{ period: string }>) => null,
            Stats: createBottomTabScreen({
              screen: (_: StaticScreenProps<{ chartType: 'bar' | 'line' }>) =>
                null,
            }),
          },
        }),
        linking: {
          path: 'feed/:section?',
        },
        options: ({ route }) => {
          expectTypeOf(route.params).toEqualTypeOf<
            { section?: string } & (
              | NavigatorScreenParams<{
                  Overview: {
                    period: string;
                  };
                  Stats: {
                    chartType: 'bar' | 'line';
                  };
                }>
              | undefined
            )
          >();

          return {};
        },
      }),
    },
  });

  type TestParamList = StaticParamList<typeof TestNavigator>;

  expectTypeOf<TestParamList>().toEqualTypeOf<{
    Feed: {
      section?: string | undefined;
    } & (
      | NavigatorScreenParams<{
          Overview: {
            period: string;
          };
          Stats: {
            chartType: 'bar' | 'line';
          };
        }>
      | undefined
    );
    Settings: {
      name: string;
      age: number;
    };
    UserProfile: {
      userId: number;
      postId: string;
    };
    UserDashboard: {
      userId: string;
      section: 'posts' | 'comments';
    };
    UserSettings: {
      userId: string;
    };
    Help: {
      topic: string;
    };
    UserList: {
      userId?: number;
      filter: string;
    };
    Item: {
      id: string;
      slug: string;
      category: string;
    };
    ItemDetails: {
      itemId: string;
      infoType: 'full' | 'summary';
    };
    ItemPrice: {
      itemId: string;
      currency?: 'USD' | 'EUR';
    };
    Details: {
      detailId: string;
    };
    About: undefined;
    Dashboard:
      | NavigatorScreenParams<{
          Overview: {
            period: string;
          };
          Stats: {
            chartType: 'bar' | 'line';
          };
        }>
      | undefined;
  }>();
}
