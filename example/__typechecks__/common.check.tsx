import type {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import type {
  DrawerNavigationOptions,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import type {
  CompositeScreenProps,
  NavigationHelpers,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { StackNavigationOptions } from '@react-navigation/stack';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { expectTypeOf } from 'expect-type';
import * as React from 'react';

/**
 * Check for the type of the `navigation` and `route` objects with regular usage
 */
type RootStackParamList = {
  Home: NavigatorScreenParams<HomeDrawerParamList>;
  PostDetails: { id: string; section?: string };
  Login: undefined;
  NotFound: undefined;
};

type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

type HomeDrawerParamList = {
  Feed: NavigatorScreenParams<FeedTabParamList>;
  Account: undefined;
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
      'focus' | 'blur' | 'state' | 'beforeRemove' | 'drawerItemPress'
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
      'focus' | 'blur' | 'state' | 'beforeRemove' | 'tabPress' | 'tabLongPress'
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
 * Check for errors with `navigation.navigate`
 */
type ThirdParamList = {
  HasParams1: { id: string };
  HasParams2: { user: string };
  NoParams: undefined;
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
};
