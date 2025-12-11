/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import type {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import type {
  DrawerNavigationOptions,
  DrawerNavigationProp,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';
import {
  type CompositeNavigationProp,
  type CompositeScreenProps,
  type DrawerNavigationState,
  type GenericNavigation,
  Link,
  type LinkingOptions,
  type NavigationAction,
  NavigationContainer,
  type NavigationContainerRef,
  type NavigationHelpers,
  type NavigationProp,
  type NavigationRoute,
  type NavigationState,
  type NavigatorScreenParams,
  type ParamListBase,
  type RootParamList,
  type Route,
  type RouteForName,
  type RouteProp,
  type StackNavigationState,
  type Theme,
  useLinkProps,
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {
  createStackNavigator,
  type StackNavigationOptions,
  type StackNavigationProp,
  type StackOptionsArgs,
  type StackScreenProps,
} from '@react-navigation/stack';
import { expectTypeOf } from 'expect-type';

import type { BottomTabParams } from '../src/Screens/BottomTabs';
import type { StaticScreenParams } from '../src/Screens/Static';

/**
 * Check for the type of the `navigation` and `route` objects with regular usage
 */
type RootStackParamList = {
  Home: NavigatorScreenParams<HomeDrawerParamList>;
  Albums: NavigatorScreenParams<AlbumTabParamList>;
  Updates: NavigatorScreenParams<UpdatesTabParamList> | undefined;
  PostDetails: { id: string; section?: string };
  Settings: { path: string } | undefined;
  Login: undefined;
  NotFound: undefined;
};

type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

type HomeDrawerParamList = {
  Feed: NavigatorScreenParams<FeedTabParamList>;
  Account: undefined;
};

type AlbumTabParamList = {
  Playlist: undefined;
  Artist: { id: string };
};

type UpdatesTabParamList = {
  Notifications: { type: 'all' | 'mentions' | 'replies' };
  Timeline: undefined;
};

type HomeDrawerScreenProps<T extends keyof HomeDrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<HomeDrawerParamList, T>,
    RootStackScreenProps<'Home'>
  >;

type FeedTabParamList = {
  Popular: { filter: 'day' | 'week' | 'month' };
  Latest: undefined;
};

type FeedTabScreenProps<T extends keyof FeedTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<FeedTabParamList, T>,
    HomeDrawerScreenProps<'Feed'>
  >;

const Stack = createStackNavigator<RootStackParamList>();

expectTypeOf(Stack.Navigator).parameter(0).toMatchObjectType<{
  initialRouteName?: keyof RootStackParamList;
}>();

expectTypeOf(Stack.Screen).parameter(0).toExtend<{
  name?: keyof RootStackParamList;
}>();

export const PostDetailsScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'PostDetails'>) => {
  expectTypeOf(route.name).toEqualTypeOf<'PostDetails'>();
  expectTypeOf(route.name).not.toEqualTypeOf<'Details'>();
  expectTypeOf(route.params).toEqualTypeOf<
    Readonly<{ id: string; section?: string }>
  >();

  expectTypeOf(navigation.setParams)
    .parameter(0)
    .toEqualTypeOf<{ id?: string; section?: string }>();

  expectTypeOf(navigation.replaceParams)
    .parameter(0)
    .toEqualTypeOf<{ id: string; section?: string }>();

  expectTypeOf(navigation.push)
    .parameter(0)
    .toEqualTypeOf<keyof RootStackParamList>();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toEqualTypeOf<Partial<StackNavigationOptions>>();

  expectTypeOf(navigation.addListener)
    .parameter(0)
    .toEqualTypeOf<
      | 'focus'
      | 'blur'
      | 'state'
      | 'beforeRemove'
      | 'transitionStart'
      | 'transitionEnd'
      | 'gestureStart'
      | 'gestureEnd'
      | 'gestureCancel'
    >();
  expectTypeOf(navigation.addListener).returns.toEqualTypeOf<() => void>();

  navigation.addListener('transitionStart', (e) => {
    expectTypeOf(e.type).toEqualTypeOf<'transitionStart'>();
  });

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();
  expectTypeOf(navigation.getParent)
    .parameter(0)
    .toEqualTypeOf<'PostDetails' | undefined>();
};

export const FeedScreen = ({
  navigation,
  route,
}: HomeDrawerScreenProps<'Feed'>) => {
  expectTypeOf(route.name).toEqualTypeOf<'Feed'>();

  expectTypeOf(navigation.push)
    .parameter(0)
    .toEqualTypeOf<keyof RootStackParamList>();
  expectTypeOf(navigation.jumpTo)
    .parameter(0)
    .toEqualTypeOf<keyof HomeDrawerParamList>();

  expectTypeOf(navigation.openDrawer).toBeFunction();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toEqualTypeOf<Partial<DrawerNavigationOptions>>();

  expectTypeOf(navigation.addListener)
    .parameter(0)
    .toEqualTypeOf<
      | 'focus'
      | 'blur'
      | 'state'
      | 'beforeRemove'
      | 'drawerItemPress'
      | 'transitionStart'
      | 'transitionEnd'
      | 'gestureStart'
      | 'gestureEnd'
      | 'gestureCancel'
    >();

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'drawer'>();
  expectTypeOf(navigation.getParent)
    .parameter(0)
    .toEqualTypeOf<'Feed' | 'Home' | undefined>();
};

export const PopularScreen = ({
  navigation,
  route,
}: FeedTabScreenProps<'Popular'>) => {
  expectTypeOf(route.name).toEqualTypeOf<'Popular'>();

  expectTypeOf(navigation.push)
    .parameter(0)
    .toEqualTypeOf<keyof RootStackParamList>();

  expectTypeOf<Parameters<typeof navigation.jumpTo>[0]>().toEqualTypeOf<
    keyof HomeDrawerParamList
  >();

  expectTypeOf(navigation.openDrawer).toBeFunction();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toEqualTypeOf<Partial<BottomTabNavigationOptions>>();

  expectTypeOf(navigation.addListener)
    .parameter(0)
    .toEqualTypeOf<
      | 'focus'
      | 'blur'
      | 'state'
      | 'beforeRemove'
      | 'tabPress'
      | 'tabLongPress'
      | 'transitionStart'
      | 'transitionEnd'
    >();

  expectTypeOf(navigation.setParams)
    .parameter(0)
    .toEqualTypeOf<Partial<FeedTabParamList['Popular']>>();

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'tab'>();
  expectTypeOf(navigation.getParent)
    .parameter(0)
    .toEqualTypeOf<'Feed' | 'Home' | 'Popular' | undefined>();
};

export const LatestScreen = ({
  navigation,
  route,
}: FeedTabScreenProps<'Latest'>) => {
  expectTypeOf(route.name).toEqualTypeOf<'Latest'>();

  expectTypeOf(navigation.push)
    .parameter(0)
    .toEqualTypeOf<keyof RootStackParamList>();

  expectTypeOf<Parameters<typeof navigation.jumpTo>[0]>().toEqualTypeOf<
    keyof HomeDrawerParamList
  >();

  expectTypeOf(navigation.openDrawer).toBeFunction();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toEqualTypeOf<Partial<BottomTabNavigationOptions>>();

  expectTypeOf(navigation.setParams).parameter(0).toEqualTypeOf<undefined>();

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'tab'>();
  expectTypeOf(navigation.getParent)
    .parameter(0)
    .toEqualTypeOf<'Feed' | 'Home' | 'Latest' | undefined>();
};

/**
 * Check for errors when the screen component isn't typed correctly
 */
type SecondParamList = {
  HasParams1: { id: string };
  HasParams2: { user: string };
  NoParams: undefined;
};

const SecondStack = createStackNavigator<SecondParamList>();

// No error when type for props is correct
<SecondStack.Screen
  name="HasParams1"
  component={(_: StackScreenProps<SecondParamList, 'HasParams1'>) => <></>}
/>;

<SecondStack.Screen
  name="HasParams1"
  component={(_: { route: { params: { id: string } } }) => <></>}
/>;

<SecondStack.Screen
  name="NoParams"
  component={(_: StackScreenProps<SecondParamList, 'NoParams'>) => <></>}
/>;

<SecondStack.Screen
  name="NoParams"
  component={(_: { route: { params?: undefined } }) => <></>}
/>;

// No error when the component hasn't specified params
<SecondStack.Screen
  name="HasParams1"
  component={(_: { route: {} }) => <></>}
/>;

// No error when the component has specified params as optional
<SecondStack.Screen
  name="HasParams1"
  component={(_: { route: { params: { id?: string } } }) => <></>}
/>;

// No error when the component doesn't take route prop
<SecondStack.Screen name="HasParams1" component={() => <></>} />;

<SecondStack.Screen
  name="HasParams1"
  component={(_: { navigation: unknown }) => <></>}
/>;

<SecondStack.Screen name="NoParams" component={() => <></>} />;

<SecondStack.Screen
  name="NoParams"
  component={(_: { navigation: unknown }) => <></>}
/>;

// Error if props don't match type
<SecondStack.Screen
  name="HasParams1"
  // @ts-expect-error
  component={(_: StackScreenProps<SecondParamList, 'HasParams2'>) => <></>}
/>;

<SecondStack.Screen
  name="HasParams1"
  // @ts-expect-error
  component={(_: { route: { params: { ids: string } } }) => <></>}
/>;

<SecondStack.Screen
  name="NoParams"
  // @ts-expect-error
  component={(_: StackScreenProps<SecondParamList, 'HasParams1'>) => <></>}
/>;

<SecondStack.Screen
  name="NoParams"
  // @ts-expect-error
  component={(_: { route: { params: { ids: string } } }) => <></>}
/>;

// Error if component specifies a prop other than route or navigation
<SecondStack.Screen
  name="HasParams1"
  // @ts-expect-error
  component={(_: { foo: number }) => <></>}
/>;

<SecondStack.Screen
  name="NoParams"
  // @ts-expect-error
  component={(_: { foo: number }) => <></>}
/>;

/**
 * Check for options type in Screen config
 */
<SecondStack.Screen
  name="HasParams1"
  component={() => <></>}
  options={{
    headerShown: false,
  }}
/>;

<SecondStack.Screen
  name="HasParams1"
  component={() => <></>}
  options={{
    // @ts-expect-error
    headerShown: 13,
  }}
/>;

<SecondStack.Screen
  name="HasParams1"
  component={() => <></>}
  options={() => ({
    headerShown: false,
  })}
/>;

<SecondStack.Screen
  name="HasParams1"
  component={() => <></>}
  // @ts-expect-error
  options={() => ({
    headerShown: 13,
  })}
/>;

<SecondStack.Screen
  name="HasParams1"
  component={() => <></>}
  options={({ route, navigation, theme }) => {
    expectTypeOf(route.name).toEqualTypeOf<'HasParams1'>();
    expectTypeOf(route.params).toEqualTypeOf<Readonly<{ id: string }>>();
    expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();
    expectTypeOf(navigation.push)
      .parameter(0)
      .toEqualTypeOf<keyof SecondParamList>();
    expectTypeOf(theme).toEqualTypeOf<Theme>();

    return {};
  }}
/>;

<SecondStack.Screen
  name="HasParams1"
  component={() => <></>}
  options={({
    route,
    navigation,
    theme,
  }: StackOptionsArgs<SecondParamList, 'HasParams1'>) => {
    expectTypeOf(route.name).toEqualTypeOf<'HasParams1'>();
    expectTypeOf(route.params).toEqualTypeOf<Readonly<{ id: string }>>();
    expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();
    expectTypeOf(navigation.push)
      .parameter(0)
      .toEqualTypeOf<keyof SecondParamList>();
    expectTypeOf(theme).toEqualTypeOf<Theme>();

    return {};
  }}
/>;

/**
 * Check for listeners type in Screen config
 */
<SecondStack.Screen
  name="HasParams1"
  component={(_: StackScreenProps<SecondParamList, 'HasParams1'>) => <></>}
  listeners={{
    focus: (e) => {
      expectTypeOf(e.type).toEqualTypeOf<'focus'>();
      expectTypeOf(e.data).toEqualTypeOf<undefined>();
    },
    beforeRemove: (e) => {
      expectTypeOf(e.type).toEqualTypeOf<'beforeRemove'>();
      expectTypeOf(e.data.action).toEqualTypeOf<NavigationAction>();
      expectTypeOf(e.preventDefault).toEqualTypeOf<() => void>();
    },
    transitionStart: (e) => {
      expectTypeOf(e.type).toEqualTypeOf<'transitionStart'>();
      expectTypeOf(e.data.closing).toEqualTypeOf<boolean>();
    },
  }}
/>;

<SecondStack.Screen
  name="HasParams1"
  component={() => <></>}
  listeners={({ route, navigation }) => {
    expectTypeOf(route.name).toEqualTypeOf<'HasParams1'>();
    expectTypeOf(route.params).toEqualTypeOf<Readonly<{ id: string }>>();
    expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();
    expectTypeOf(navigation.push)
      .parameter(0)
      .toEqualTypeOf<keyof SecondParamList>();

    return {};
  }}
/>;

<SecondStack.Screen
  name="HasParams1"
  component={() => <></>}
  listeners={({
    route,
    navigation,
  }: StackScreenProps<SecondParamList, 'HasParams1'>) => {
    expectTypeOf(route.name).toEqualTypeOf<'HasParams1'>();
    expectTypeOf(route.params).toEqualTypeOf<Readonly<{ id: string }>>();
    expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();
    expectTypeOf(navigation.push)
      .parameter(0)
      .toEqualTypeOf<keyof SecondParamList>();

    return {};
  }}
/>;

/**
 * Check for errors with `navigation.navigate`
 */
type ThirdParamList = {
  HasParams1: { id: string };
  HasParams2: { user: string };
  NoParams: undefined;
  NoParams2: undefined;
};

export const ThirdScreen = ({
  navigation,
}: {
  navigation: NavigationHelpers<ThirdParamList>;
}) => {
  // No error when correct params are passed
  navigation.navigate('NoParams');
  navigation.navigate('HasParams1', { id: '123' });
  navigation.navigate('HasParams2', { user: '123' });

  // Error when incorrect params are passed
  // @ts-expect-error
  navigation.navigate('HasParams1', { user: '123' });
  // @ts-expect-error
  navigation.navigate('HasParams2', { id: '123' });

  // Union type and type narrowing
  const ScreenName: keyof ThirdParamList = null as any;

  // @ts-expect-error
  navigation.navigate(ScreenName);

  // @ts-expect-error
  if (ScreenName === 'HasParams1') navigation.navigate(ScreenName);

  if (ScreenName === 'HasParams1')
    navigation.navigate(ScreenName, { id: '123' });

  if (ScreenName === 'NoParams') navigation.navigate(ScreenName);

  // @ts-expect-error
  if (ScreenName === 'NoParams') navigation.navigate(ScreenName, { id: '123' });

  const ScreenName2: 'NoParams' | 'NoParams2' = null as any;

  navigation.navigate(ScreenName2);
};

/**
 * Check for errors on getCurrentRoute
 */
declare const navigationRef: NavigationContainerRef<RootStackParamList>;
const route = navigationRef.getCurrentRoute()!;

switch (route.name) {
  case 'PostDetails':
    expectTypeOf(route.params).toExtend<{
      id: string;
      section?: string;
    }>();
    break;
  case 'Login':
    expectTypeOf(route.params).toEqualTypeOf<undefined>();
    break;
  case 'NotFound':
    expectTypeOf(route.params).toEqualTypeOf<undefined>();
    break;
  // Checks for nested routes
  case 'Account':
    expectTypeOf(route.params).toEqualTypeOf<undefined>();
    break;
  case 'Popular':
    expectTypeOf(route.params).toExtend<{
      filter: 'day' | 'week' | 'month';
    }>();
    break;
  case 'Latest':
    expectTypeOf(route.params).toEqualTypeOf<undefined>();
    break;
}

declare const navigationRefUntyped: NavigationContainerRef<string>;

expectTypeOf(navigationRefUntyped.getCurrentRoute()).toEqualTypeOf<
  Route<string> | undefined
>();

/**
 * Screen and params for Link, Button, etc.
 */
// @ts-expect-error
useLinkProps<RootStackParamList>({ screen: 'Albums' });
// @ts-expect-error
useLinkProps<RootStackParamList>({ screen: 'Album' });
useLinkProps<RootStackParamList>({
  screen: 'Albums',
  params: { screen: 'Playlist' },
});
useLinkProps<RootStackParamList>({ screen: 'Settings' });
useLinkProps<RootStackParamList>({
  screen: 'Settings',
  params: { path: '123' },
});
// @ts-expect-error
useLinkProps<RootStackParamList>({ screen: 'PostDetails' });
useLinkProps<RootStackParamList>({
  screen: 'PostDetails',
  params: { id: '123' },
});

useLinkProps<RootStackParamList>({
  screen: 'PostDetails',
  params: { id: '123', section: '123' },
});
useLinkProps<RootStackParamList>({
  screen: 'PostDetails',
  // @ts-expect-error
  params: { id: 123 },
});
useLinkProps<RootStackParamList>({
  screen: 'PostDetails',
  // @ts-expect-error
  params: { id: '123', section: 123 },
});
useLinkProps<RootStackParamList>({
  screen: 'PostDetails',
  // @ts-expect-error
  params: { ids: '123' },
});
useLinkProps<RootStackParamList>({
  screen: 'PostDetails',
  // @ts-expect-error
  params: {},
});
useLinkProps<RootStackParamList>({ screen: 'Login' });

// @ts-expect-error
<Link<RootStackParamList> screen="Album">Albums</Link>;
// @ts-expect-error
<Link<RootStackParamList> screen="Albums">Albums</Link>;
<Link<RootStackParamList> screen="Albums" params={{ screen: 'Playlist' }}>
  Albums
</Link>;
<Link<RootStackParamList> screen="Settings">Settings</Link>;
<Link<RootStackParamList> screen="Settings" params={{ path: '123' }}>
  Settings
</Link>;
// @ts-expect-error
<Link<RootStackParamList> screen="PostDetails">PostDetails</Link>;
<Link<RootStackParamList> screen="PostDetails" params={{ id: '123' }}>
  PostDetails
</Link>;
<Link<RootStackParamList>
  screen="PostDetails"
  params={{ id: '123', section: '123' }}
>
  PostDetails
</Link>;
// @ts-expect-error
<Link<RootStackParamList> screen="PostDetails" params={{ id: 123 }}>
  PostDetails
</Link>;
<Link<RootStackParamList>
  screen="PostDetails"
  // @ts-expect-error
  params={{ id: '123', section: 123 }}
>
  PostDetails
</Link>;
// @ts-expect-error
<Link<RootStackParamList> screen="PostDetails" params={{ ids: '123' }}>
  PostDetails
</Link>;
// @ts-expect-error
<Link<RootStackParamList> screen="PostDetails" params={{}}>
  PostDetails
</Link>;
<Link<RootStackParamList> screen="Login">Albums</Link>;
<Link<RootStackParamList> screen="Updates">Updates</Link>;
<Link<RootStackParamList> screen="Updates" params={{ screen: 'Timeline' }}>
  Timeline
</Link>;

// @ts-expect-error
<Button<RootStackParamList> screen="Album">Albums</Button>;
// @ts-expect-error
<Button<RootStackParamList> screen="Albums">Albums</Button>;
<Button<RootStackParamList> screen="Albums" params={{ screen: 'Playlist' }}>
  Albums
</Button>;
<Button<RootStackParamList> screen="Settings">Settings</Button>;
<Button<RootStackParamList> screen="Settings" params={{ path: '123' }}>
  Settings
</Button>;
// @ts-expect-error
<Button<RootStackParamList> screen="PostDetails">PostDetails</Button>;
<Button<RootStackParamList> screen="PostDetails" params={{ id: '123' }}>
  PostDetails
</Button>;
<Button<RootStackParamList>
  screen="PostDetails"
  params={{ id: '123', section: '123' }}
>
  PostDetails
</Button>;
// @ts-expect-error
<Button<RootStackParamList> screen="PostDetails" params={{ id: 123 }}>
  PostDetails
</Button>;
<Button<RootStackParamList>
  screen="PostDetails"
  // @ts-expect-error
  params={{ id: '123', section: 123 }}
>
  PostDetails
</Button>;
// @ts-expect-error
<Button<RootStackParamList> screen="PostDetails" params={{ ids: '123' }}>
  PostDetails
</Button>;
// @ts-expect-error
<Button<RootStackParamList> screen="PostDetails" params={{}}>
  PostDetails
</Button>;
<Button<RootStackParamList> screen="Login">Albums</Button>;
<Button<RootStackParamList> screen="Updates">Updates</Button>;
<Button<RootStackParamList> screen="Updates" params={{ screen: 'Timeline' }}>
  Timeline
</Button>;

// @ts-expect-error
useLinkProps({ screen: 'SimpleStack' });
// @ts-expect-error
useLinkProps({ screen: 'SimpleStac' });
useLinkProps({
  screen: 'SimpleStack',
  params: { screen: 'Albums' },
});
useLinkProps({ screen: 'Home' });
useLinkProps({
  screen: 'Home',
  params: { screen: 'Examples' },
});

// @ts-expect-error
<Link screen="SimpleStack">SimpleStack</Link>;
// @ts-expect-error
<Link screen="SimpleStac">SimpleStack</Link>;
<Link screen="SimpleStack" params={{ screen: 'Albums' }}>
  SimpleStack
</Link>;
<Link screen="Home">Home</Link>;
<Link screen="Home" params={{ screen: 'Examples' }}>
  Home
</Link>;

// @ts-expect-error
<Button screen="SimpleStack">SimpleStack</Button>;
// @ts-expect-error
<Button screen="SimpleStac">SimpleStack</Button>;
<Button screen="SimpleStack" params={{ screen: 'Albums' }}>
  SimpleStack
</Button>;
<Button screen="Home">Home</Button>;
<Button screen="Home" params={{ screen: 'Examples' }}>
  Home
</Button>;

/**
 * Check for ParamsForRoute
 */

/* Invalid route name */
expectTypeOf<
  RouteForName<RootStackParamList, 'NotAKey'>['params']
>().toBeNever();

/* Undefined params */
expectTypeOf<
  RouteForName<RootStackParamList, 'Login'>['params']
>().toEqualTypeOf<Readonly<RootStackParamList['Login']>>();

/* Valid params */
expectTypeOf<
  RouteForName<RootStackParamList, 'PostDetails'>['params']
>().toEqualTypeOf<Readonly<RootStackParamList['PostDetails']>>();

/* Optional params */
expectTypeOf<
  RouteForName<RootStackParamList, 'Settings'>['params']
>().toEqualTypeOf<Readonly<RootStackParamList['Settings']>>();

/* Nested screen */
expectTypeOf<
  RouteForName<RootStackParamList, 'Artist'>['params']
>().toEqualTypeOf<Readonly<AlbumTabParamList['Artist']>>();

/* Nested screen with optional params */
expectTypeOf<
  RouteForName<RootStackParamList, 'Notifications'>['params']
>().toEqualTypeOf<Readonly<UpdatesTabParamList['Notifications']>>();

/* Nested screen with navigator */
expectTypeOf<
  RouteForName<HomeDrawerParamList, 'Feed'>['params']
>().toEqualTypeOf<Readonly<HomeDrawerParamList['Feed']>>();

/* Multiple screens with same name */
type MultiParamList = {
  MyScreen: { id: string };
  A: NavigatorScreenParams<{
    MyScreen: { user: string };
  }>;
  B: NavigatorScreenParams<{
    MyScreen: { group: string };
  }>;
  C: { other: number };
};

expectTypeOf<
  RouteForName<MultiParamList, 'MyScreen'>['params']
>().toEqualTypeOf<
  Readonly<{ id: string } | { user: string } | { group: string }>
>();

/**
 * Check for useRoute return type based on the arguments
 */
expectTypeOf(useRoute()).toEqualTypeOf<RouteForName<RootParamList, string>>();

{
  const route = useRoute();

  if (route.name === 'NotFound') {
    expectTypeOf(route).toEqualTypeOf<RouteProp<RootParamList, 'NotFound'>>();
  }

  if (route.name === 'TabChat') {
    expectTypeOf(route).toEqualTypeOf<
      Route<'TabChat', { count: number } | undefined>
    >();
  }

  // @ts-expect-error
  if (route.name === 'Invalid') {
    // error
  }
}

expectTypeOf(
  useRoute<RootStackParamList, 'Settings'>('Settings')
).toEqualTypeOf<RouteProp<RootStackParamList, 'Settings'>>();

expectTypeOf(useRoute<RootStackParamList, 'Artist'>('Artist')).toEqualTypeOf<
  Route<'Artist', AlbumTabParamList['Artist']>
>();

expectTypeOf(
  useRoute<RootStackParamList, 'Notifications'>('Notifications')
).toEqualTypeOf<Route<'Notifications', UpdatesTabParamList['Notifications']>>();

expectTypeOf(useRoute<MultiParamList, 'MyScreen'>('MyScreen')).toEqualTypeOf<
  | Route<'MyScreen', { id: string }>
  | Route<'MyScreen', { user: string }>
  | Route<'MyScreen', { group: string }>
>();

expectTypeOf(useRoute('NotFound')).toEqualTypeOf<
  RouteProp<RootParamList, 'NotFound'>
>();

expectTypeOf(useRoute('TabChat')).toEqualTypeOf<
  Route<'TabChat', { count: number } | undefined>
>();

// @ts-expect-error
useRoute<RootStackParamList, 'Invalid'>('Invalid');

// @ts-expect-error
useRoute('Invalid');

/**
 * Check for useNavigation return type based on the arguments
 */

// @ts-expect-error
useNavigation('Invalid');

{
  const navigation = useNavigation();

  expectTypeOf(navigation).toEqualTypeOf<GenericNavigation<RootParamList>>();

  expectTypeOf(navigation.getParent()).toEqualTypeOf<
    NavigationProp<ParamListBase> | undefined
  >();

  expectTypeOf(navigation.getState()).toEqualTypeOf<
    NavigationState | undefined
  >();

  expectTypeOf(navigation.setParams).parameter(0).toEqualTypeOf<unknown>();

  expectTypeOf(navigation.replaceParams).parameter(0).toEqualTypeOf<unknown>();

  expectTypeOf(navigation.pushParams).parameter(0).toEqualTypeOf<unknown>();
}

{
  const navigation = useNavigation<typeof Stack>();

  expectTypeOf(navigation).toEqualTypeOf<
    {
      [K in keyof RootStackParamList]: StackNavigationProp<
        RootStackParamList,
        K
      >;
    }[keyof RootStackParamList]
  >();

  expectTypeOf(navigation.getParent()).toEqualTypeOf<
    NavigationProp<ParamListBase> | undefined
  >();

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

  expectTypeOf(navigation.getState().routeNames).toEqualTypeOf<
    (keyof RootStackParamList)[]
  >();

  // @ts-expect-error
  expectTypeOf(navigation.setParams).parameter(0).toBeNever();

  // @ts-expect-error
  expectTypeOf(navigation.replaceParams).parameter(0).toBeNever();

  // @ts-expect-error
  expectTypeOf(navigation.pushParams).parameter(0).toBeNever();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toEqualTypeOf<Partial<StackNavigationOptions>>();
}

{
  const navigation = useNavigation('NotFound');

  expectTypeOf(navigation).toEqualTypeOf<
    StackNavigationProp<RootParamList, 'NotFound'>
  >();

  expectTypeOf(navigation.getParent)
    .parameter(0)
    .toEqualTypeOf<'NotFound' | undefined>();

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

  expectTypeOf(navigation.getState().routeNames).toEqualTypeOf<
    (keyof RootParamList)[]
  >();

  expectTypeOf(navigation.setParams).parameter(0).toBeUndefined();

  expectTypeOf(navigation.replaceParams).parameter(0).toBeUndefined();

  expectTypeOf(navigation.pushParams).parameter(0).toBeUndefined();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toEqualTypeOf<Partial<StackNavigationOptions>>();
}

{
  const navigation = useNavigation('Examples');

  expectTypeOf(navigation).toEqualTypeOf<
    CompositeNavigationProp<
      DrawerNavigationProp<{ Examples: undefined }, 'Examples'>,
      StackNavigationProp<RootParamList, 'Home'>
    >
  >();

  expectTypeOf(navigation.getParent)
    .parameter(0)
    .toEqualTypeOf<'Examples' | 'Home' | undefined>();

  expectTypeOf(navigation.getParent('Home')).toEqualTypeOf<
    StackNavigationProp<RootParamList, 'Home'>
  >();

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'drawer'>();

  expectTypeOf(navigation.getState().routeNames).toEqualTypeOf<'Examples'[]>();

  expectTypeOf(navigation.setParams).parameter(0).toBeUndefined();

  expectTypeOf(navigation.replaceParams).parameter(0).toBeUndefined();

  expectTypeOf(navigation.pushParams).parameter(0).toBeUndefined();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toEqualTypeOf<Partial<DrawerNavigationOptions>>();
}

{
  const navigation = useNavigation('Home');

  expectTypeOf(navigation).toEqualTypeOf<
    StackNavigationProp<RootParamList, 'Home'> &
      CompositeNavigationProp<
        StackNavigationProp<StaticScreenParams, 'Home'>,
        StackNavigationProp<RootParamList, 'StaticScreen'>
      >
  >();

  expectTypeOf(navigation.getParent)
    .parameter(0)
    .toEqualTypeOf<'Home' | 'StaticScreen' | undefined>();

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

  expectTypeOf(navigation.getState().routeNames).toEqualTypeOf<
    (keyof RootParamList)[]
  >();

  expectTypeOf(navigation.setParams)
    .parameter(0)
    .toEqualTypeOf<
      Partial<NavigatorScreenParams<{ Examples: undefined }> | undefined>
    >();

  expectTypeOf(navigation.replaceParams)
    .parameter(0)
    .toEqualTypeOf<
      NavigatorScreenParams<{ Examples: undefined }> | undefined
    >();

  expectTypeOf(navigation.pushParams)
    .parameter(0)
    .toEqualTypeOf<
      NavigatorScreenParams<{ Examples: undefined }> | undefined
    >();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toEqualTypeOf<Partial<StackNavigationOptions>>();
}

/**
 * Routes from dynamic dynamic navigator should return generic navigation
 */
{
  const navigation = useNavigation('TabChat');

  expectTypeOf(navigation).toEqualTypeOf<
    GenericNavigation<
      BottomTabParams,
      'TabChat',
      NavigationState<BottomTabParams>
    >
  >();

  expectTypeOf(navigation.setParams)
    .parameter(0)
    .toEqualTypeOf<Partial<BottomTabParams['TabChat']>>();

  expectTypeOf(navigation.replaceParams)
    .parameter(0)
    .toEqualTypeOf<BottomTabParams['TabChat']>();

  expectTypeOf(navigation.pushParams)
    .parameter(0)
    .toEqualTypeOf<BottomTabParams['TabChat']>();

  expectTypeOf(navigation.getState().type).toEqualTypeOf<string>();

  expectTypeOf(navigation.getState().routeNames).toEqualTypeOf<
    (keyof BottomTabParams)[]
  >();
}

/**
 * Check for useNavigationState return type based on the arguments
 */
{
  const state = useNavigationState((state) => state);

  expectTypeOf(state.routeNames).toEqualTypeOf<string[]>();

  /* Selecting specific properties */
  const index = useNavigationState((state) => state.index);

  expectTypeOf(index).toEqualTypeOf<number>();

  const routes = useNavigationState((state) => state.routes);

  expectTypeOf(routes).toEqualTypeOf<NavigationRoute<ParamListBase, string>[]>(
    routes
  );
}

{
  const state = useNavigationState<
    StackNavigationState<RootStackParamList>,
    typeof Stack,
    'PostDetails'
  >('PostDetails', (state) => state);

  expectTypeOf(state.type).toEqualTypeOf<'stack'>();

  expectTypeOf(state.routeNames).toEqualTypeOf<(keyof RootStackParamList)[]>();

  /* Invalid drawer state specified for stack */
  useNavigationState<
    DrawerNavigationState<RootStackParamList>,
    typeof Stack,
    'PostDetails'
    // @ts-expect-error
  >('PostDetails', (state) => state);
}

{
  const type = useNavigationState('Examples', (state) => state.type);

  expectTypeOf(type).toEqualTypeOf<'drawer'>();

  const routeNames = useNavigationState(
    'Examples',
    (state) => state.routeNames
  );

  expectTypeOf(routeNames).toEqualTypeOf<'Examples'[]>();
}

{
  const index = useNavigationState('NotFound', (state) => state.index);

  expectTypeOf(index).toEqualTypeOf<number>();

  const routeNames = useNavigationState(
    'NotFound',
    (state) => state.routeNames
  );

  expectTypeOf(routeNames).toEqualTypeOf<(keyof RootParamList)[]>();
}

{
  const index = useNavigationState('TabChat', (state) => state.index);

  expectTypeOf(index).toEqualTypeOf<number>();

  const routeNames = useNavigationState('TabChat', (state) => state.routeNames);

  expectTypeOf(routeNames).toEqualTypeOf<(keyof BottomTabParams)[]>();
}

/**
 * Check for `linking` prop type validation based on ParamList
 */
{
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        Home: {
          screens: {
            Feed: {
              screens: {
                Popular: 'popular',
                Latest: 'latest',
              },
            },
            Account: 'account',
          },
        },
        PostDetails: 'post/:id',
        Settings: 'settings',
        Login: 'login',
        NotFound: '*',
      },
    },
  };

  <NavigationContainer linking={linking}>{null}</NavigationContainer>;
}

{
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        PostDetails: {
          path: 'post/:id/:section?',
          parse: {
            id: (value) => value,
            section: (value) => value,
          },
          stringify: {
            id: (value) => value,
            section: (value) => value ?? '',
          },
        },
        Albums: {
          screens: {
            Artist: {
              path: 'artist/:id',
              parse: {
                id: (value) => value,
              },
              stringify: {
                id: (value) => value,
              },
            },
          },
        },
      },
    },
  };

  <NavigationContainer linking={linking}>{null}</NavigationContainer>;
}

{
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        // @ts-expect-error
        InvalidScreen: 'invalid',
      },
    },
  };

  <NavigationContainer linking={linking}>{null}</NavigationContainer>;
}

{
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        PostDetails: {
          path: 'post/:id',
          parse: {
            // @ts-expect-error
            invalidParam: (value) => value,
          },
        },
      },
    },
  };

  <NavigationContainer linking={linking}>{null}</NavigationContainer>;
}

{
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        PostDetails: {
          path: 'post/:id',
          stringify: {
            // @ts-expect-error
            invalidParam: (value) => String(value),
          },
        },
      },
    },
  };

  <NavigationContainer linking={linking}>{null}</NavigationContainer>;
}

{
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        PostDetails: {
          path: 'post/:id',
          parse: {
            id: (value) => {
              expectTypeOf(value).toEqualTypeOf<string>();
              return value;
            },
          },
          stringify: {
            id: (value) => {
              expectTypeOf(value).toEqualTypeOf<string>();
              return value;
            },
            section: (value) => {
              expectTypeOf(value).toEqualTypeOf<string | undefined>();
              return value ?? '';
            },
          },
        },
      },
    },
  };

  <NavigationContainer linking={linking}>{null}</NavigationContainer>;
}

{
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        Home: {
          screens: {
            // @ts-expect-error
            InvalidNested: 'invalid',
          },
        },
      },
    },
  };

  <NavigationContainer linking={linking}>{null}</NavigationContainer>;
}

{
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        PostDetails: {
          path: 'post/:id',
          // @ts-expect-error - PostDetails is a leaf route, not a navigator
          screens: {},
        },
      },
    },
  };

  <NavigationContainer linking={linking}>{null}</NavigationContainer>;
}

{
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        Home: {
          initialRouteName: 'Feed',
          screens: {
            Feed: 'feed',
            Account: 'account',
          },
        },
      },
    },
  };

  <NavigationContainer linking={linking}>{null}</NavigationContainer>;
}

{
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        Home: {
          // @ts-expect-error
          initialRouteName: 'InvalidRoute',
          screens: {
            Feed: 'feed',
          },
        },
      },
    },
  };

  <NavigationContainer linking={linking}>{null}</NavigationContainer>;
}
