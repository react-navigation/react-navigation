/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import type {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import type {
  DrawerNavigationOptions,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';
import {
  type CompositeScreenProps,
  Link,
  type NavigationAction,
  type NavigationContainerRef,
  type NavigationHelpers,
  type NavigatorScreenParams,
  type Route,
  useLinkProps,
} from '@react-navigation/native';
import {
  createStackNavigator,
  type StackNavigationOptions,
  type StackOptionsArgs,
  type StackScreenProps,
} from '@react-navigation/stack';
import { expectTypeOf } from 'expect-type';

/**
 * Check for the type of the `navigation` and `route` objects with regular usage
 */
type RootStackParamList = {
  Home: NavigatorScreenParams<HomeDrawerParamList>;
  Albums: NavigatorScreenParams<AlbumTabParamList>;
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

type HomeDrawerScreenProps<T extends keyof HomeDrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<HomeDrawerParamList, T, 'LeftDrawer'>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

type FeedTabParamList = {
  Popular: { filter: 'day' | 'week' | 'month' };
  Latest: undefined;
};

type FeedTabScreenProps<T extends keyof FeedTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<FeedTabParamList, T, 'BottomTabs'>,
    HomeDrawerScreenProps<keyof HomeDrawerParamList>
  >;

const Stack = createStackNavigator<RootStackParamList>();

expectTypeOf(Stack.Navigator).parameter(0).toMatchTypeOf<{
  initialRouteName?: keyof RootStackParamList;
}>();

expectTypeOf(Stack.Screen).parameter(0).toMatchTypeOf<{
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
    .toMatchTypeOf<{ id?: string }>();

  expectTypeOf(navigation.push)
    .parameter(0)
    .toEqualTypeOf<keyof RootStackParamList>();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toMatchTypeOf<Partial<StackNavigationOptions>>();

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
  expectTypeOf(navigation.getParent).parameter(0).toEqualTypeOf<undefined>();
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
    .toMatchTypeOf<Partial<DrawerNavigationOptions>>();

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
    .toEqualTypeOf<'LeftDrawer' | undefined>();
};

export const PopularScreen = ({
  navigation,
  route,
}: FeedTabScreenProps<'Popular'>) => {
  expectTypeOf(route.name).toEqualTypeOf<'Popular'>();

  expectTypeOf(navigation.push)
    .parameter(0)
    .toEqualTypeOf<keyof RootStackParamList>();
  expectTypeOf(navigation.jumpTo)
    .parameter(0)
    .toEqualTypeOf<keyof HomeDrawerParamList>();

  expectTypeOf(navigation.openDrawer).toBeFunction();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toMatchTypeOf<Partial<BottomTabNavigationOptions>>();

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
    .toEqualTypeOf<'LeftDrawer' | 'BottomTabs' | undefined>();
};

export const LatestScreen = ({
  navigation,
  route,
}: FeedTabScreenProps<'Latest'>) => {
  expectTypeOf(route.name).toEqualTypeOf<'Latest'>();

  expectTypeOf(navigation.push)
    .parameter(0)
    .toEqualTypeOf<keyof RootStackParamList>();
  expectTypeOf(navigation.jumpTo)
    .parameter(0)
    .toEqualTypeOf<keyof HomeDrawerParamList>();

  expectTypeOf(navigation.openDrawer).toBeFunction();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toMatchTypeOf<Partial<BottomTabNavigationOptions>>();

  expectTypeOf(navigation.setParams).parameter(0).toEqualTypeOf<undefined>();

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'tab'>();
  expectTypeOf(navigation.getParent)
    .parameter(0)
    .toEqualTypeOf<'LeftDrawer' | 'BottomTabs' | undefined>();
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
  // @ts-expect-error
  name="HasParams1"
  component={(_: StackScreenProps<SecondParamList, 'HasParams2'>) => <></>}
/>;

<SecondStack.Screen
  name="HasParams1"
  // @ts-expect-error
  component={(_: { route: { params: { ids: string } } }) => <></>}
/>;

<SecondStack.Screen
  // @ts-expect-error
  name="NoParams"
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
    expectTypeOf(navigation.getState().type).toMatchTypeOf<'stack'>();
    expectTypeOf(navigation.push)
      .parameter(0)
      .toEqualTypeOf<keyof SecondParamList>();
    expectTypeOf(theme).toMatchTypeOf<ReactNavigation.Theme>();

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
    expectTypeOf(navigation.getState().type).toMatchTypeOf<'stack'>();
    expectTypeOf(navigation.push)
      .parameter(0)
      .toEqualTypeOf<keyof SecondParamList>();
    expectTypeOf(theme).toMatchTypeOf<ReactNavigation.Theme>();

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
    expectTypeOf(navigation.getState().type).toMatchTypeOf<'stack'>();
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
    expectTypeOf(navigation.getState().type).toMatchTypeOf<'stack'>();
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
 * Check for navigator ID
 */
type FourthParamList = {
  HasParams1: { id: string };
  HasParams2: { user: string };
  NoParams: undefined;
};

const FourthStack = createStackNavigator<FourthParamList, 'MyID'>();

expectTypeOf(FourthStack.Navigator).parameter(0).toMatchTypeOf<{
  id: 'MyID';
}>();

/**
 * Check for errors on getCurrentRoute
 */
declare const navigationRef: NavigationContainerRef<RootStackParamList>;
const route = navigationRef.getCurrentRoute()!;

switch (route.name) {
  case 'PostDetails':
    expectTypeOf(route.params).toMatchTypeOf<{
      id: string;
      section?: string;
    }>();
    break;
  case 'Login':
    expectTypeOf(route.params).toMatchTypeOf<undefined>();
    break;
  case 'NotFound':
    expectTypeOf(route.params).toMatchTypeOf<undefined>();
    break;
  // Checks for nested routes
  case 'Account':
    expectTypeOf(route.params).toMatchTypeOf<undefined>();
    break;
  case 'Popular':
    expectTypeOf(route.params).toMatchTypeOf<{
      filter: 'day' | 'week' | 'month';
    }>();
    break;
  case 'Latest':
    expectTypeOf(route.params).toMatchTypeOf<undefined>();
    break;
}

declare const navigationRefUntyped: NavigationContainerRef<string>;

expectTypeOf(navigationRefUntyped.getCurrentRoute()).toMatchTypeOf<
  Route<string> | undefined
>();

/**
 * Screen and params for Link, Button, etc.
 */
type LinkParamList = ReactNavigation.RootParamList & RootStackParamList;

// @ts-expect-error
useLinkProps<LinkParamList>({ screen: 'Albums' });
// @ts-expect-error
useLinkProps<LinkParamList>({ screen: 'Album' });
useLinkProps<LinkParamList>({
  screen: 'Albums',
  params: { screen: 'Playlist' },
});
useLinkProps<LinkParamList>({ screen: 'Settings' });
useLinkProps<LinkParamList>({
  screen: 'Settings',
  params: { path: '123' },
});
// @ts-expect-error
useLinkProps<LinkParamList>({ screen: 'PostDetails' });
useLinkProps<LinkParamList>({
  screen: 'PostDetails',
  params: { id: '123' },
});

useLinkProps<LinkParamList>({
  screen: 'PostDetails',
  params: { id: '123', section: '123' },
});
useLinkProps<LinkParamList>({
  screen: 'PostDetails',
  // @ts-expect-error
  params: { id: 123 },
});
useLinkProps<LinkParamList>({
  screen: 'PostDetails',
  // @ts-expect-error
  params: { id: '123', section: 123 },
});
useLinkProps<LinkParamList>({
  screen: 'PostDetails',
  // @ts-expect-error
  params: { ids: '123' },
});
useLinkProps<LinkParamList>({
  screen: 'PostDetails',
  // @ts-expect-error
  params: {},
});
useLinkProps<LinkParamList>({ screen: 'Login' });

// @ts-expect-error
<Link<LinkParamList> screen="Album">Albums</Link>;
// @ts-expect-error
<Link<LinkParamList> screen="Albums">Albums</Link>;
<Link<LinkParamList> screen="Albums" params={{ screen: 'Playlist' }}>
  Albums
</Link>;
<Link<LinkParamList> screen="Settings">Settings</Link>;
<Link<LinkParamList> screen="Settings" params={{ path: '123' }}>
  Settings
</Link>;
// @ts-expect-error
<Link<LinkParamList> screen="PostDetails">PostDetails</Link>;
<Link<LinkParamList> screen="PostDetails" params={{ id: '123' }}>
  PostDetails
</Link>;
<Link<LinkParamList>
  screen="PostDetails"
  params={{ id: '123', section: '123' }}
>
  PostDetails
</Link>;
<Link<LinkParamList>
  screen="PostDetails"
  // @ts-expect-error
  params={{ id: 123 }}
>
  PostDetails
</Link>;
<Link<LinkParamList>
  screen="PostDetails"
  // @ts-expect-error
  params={{ id: '123', section: 123 }}
>
  PostDetails
</Link>;
<Link<LinkParamList>
  screen="PostDetails"
  // @ts-expect-error
  params={{ ids: '123' }}
>
  PostDetails
</Link>;
<Link<LinkParamList>
  screen="PostDetails"
  // @ts-expect-error
  params={{}}
>
  PostDetails
</Link>;
<Link<LinkParamList> screen="Login">Albums</Link>;

// @ts-expect-error
<Button<LinkParamList> screen="Album">Albums</Button>;
// @ts-expect-error
<Button<LinkParamList> screen="Albums">Albums</Button>;
<Button<LinkParamList> screen="Albums" params={{ screen: 'Playlist' }}>
  Albums
</Button>;
<Button<LinkParamList> screen="Settings">Settings</Button>;
<Button<LinkParamList> screen="Settings" params={{ path: '123' }}>
  Settings
</Button>;
// @ts-expect-error
<Button<LinkParamList> screen="PostDetails">PostDetails</Button>;
<Button<LinkParamList> screen="PostDetails" params={{ id: '123' }}>
  PostDetails
</Button>;
<Button<LinkParamList>
  screen="PostDetails"
  params={{ id: '123', section: '123' }}
>
  PostDetails
</Button>;
<Button<LinkParamList>
  screen="PostDetails"
  // @ts-expect-error
  params={{ id: 123 }}
>
  PostDetails
</Button>;
<Button<LinkParamList>
  screen="PostDetails"
  // @ts-expect-error
  params={{ id: '123', section: 123 }}
>
  PostDetails
</Button>;
<Button<LinkParamList>
  screen="PostDetails"
  // @ts-expect-error
  params={{ ids: '123' }}
>
  PostDetails
</Button>;
<Button<LinkParamList>
  screen="PostDetails"
  // @ts-expect-error
  params={{}}
>
  PostDetails
</Button>;
<Button<LinkParamList> screen="Login">Albums</Button>;
