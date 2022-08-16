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
  RouteConfigComponent,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationOptions } from '@react-navigation/stack';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { expectTypeOf } from 'expect-type';
import React, { FC } from 'react';

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
    .toMatchTypeOf<StackNavigationOptions>();

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
    .toMatchTypeOf<StackNavigationOptions>();
  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toMatchTypeOf<DrawerNavigationOptions>();

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
    .toMatchTypeOf<StackNavigationOptions>();
  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toMatchTypeOf<DrawerNavigationOptions>();
  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toMatchTypeOf<BottomTabNavigationOptions>();

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
    .toMatchTypeOf<StackNavigationOptions>();
  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toMatchTypeOf<DrawerNavigationOptions>();
  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toMatchTypeOf<BottomTabNavigationOptions>();

  expectTypeOf(navigation.setParams).parameter(0).toEqualTypeOf<undefined>();

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'tab'>();
  expectTypeOf(navigation.getParent)
    .parameter(0)
    .toEqualTypeOf<'LeftDrawer' | 'BottomTabs' | undefined>();
};

// ================================================
// The checks below uses jest syntax for semantics only.
// These tests will never actually run.
// Notice the use of // @ts-expect-error for assertions
// instead of `expectTypeOf`. This is because `expect-type` fails
// to throw errors in various cases involving parameters or union types.
// ================================================

describe('RouteConfigComponent', () => {
  type ParamList = {
    hasParam: { param: string };
    hasParam2: { param2: string };
    noParam: undefined;
  };

  const Screen = <Name extends keyof ParamList>(
    _: { name: Name } & RouteConfigComponent<ParamList, Name>
  ) => null;

  it("doesn't accept incorrect route params", () => {
    const Component: FC<{ route: RouteProp<ParamList, 'hasParam'> }> = () =>
      null;
    // @ts-expect-error
    <Screen name="hasParam2" component={Component} />;
    // @ts-expect-error
    <Screen name="noParam" component={Component} />;
    // ok
    <Screen name="hasParam" component={Component} />;
  });

  it("doesn't require the component to accept the `route` or `navigation` prop", () => {
    const Component: FC<{}> = () => null;
    // ok
    <Screen name="hasParam" component={Component} />;
    // ok
    <Screen name="noParam" component={Component} />;
  });

  it('allows the component to declare any optional props', () => {
    const Component: FC<{ someProp?: string }> = () => null;
    <Screen name="hasParam" component={Component} />;
    <Screen name="noParam" component={Component} />;
  });

  it("doesn't allow a required prop that's neither `route` nor `navigation`", () => {
    const Component: FC<{ someProp: string }> = () => null;
    // @ts-expect-error
    <Screen name="hasParam" component={Component} />;
    // @ts-expect-error
    <Screen name="noParam" component={Component} />;
  });

  it('allows the component to accept just the `navigation` prop', () => {
    const Component: FC<{ navigation: object }> = () => null;
    // ok
    <Screen name="hasParam" component={Component} />;
    // ok
    <Screen name="noParam" component={Component} />;
  });
});

describe('NavigationHelpers.navigate', () => {
  type ParamList = {
    hasParam: { param: string };
    hasParam2: { param2: string };
    noParam: undefined;
  };
  const navigate: NavigationHelpers<ParamList>['navigate'] = () => {};

  it('strictly checks type of route params', () => {
    // ok
    navigate('noParam');
    // ok
    navigate('hasParam', { param: '123' });
    // @ts-expect-error
    navigate('hasParam2', { param: '123' });
  });

  it('strictly checks type of route params when a union RouteName is passed', () => {
    let routeName = undefined as unknown as keyof ParamList;

    // @ts-expect-error
    navigate(routeName);

    // ok
    if (routeName === 'noParam') navigate(routeName);
    // ok
    if (routeName === 'hasParam') navigate(routeName, { param: '123' });

    // @ts-expect-error
    if (routeName === 'hasParam') navigate(routeName);
    // @ts-expect-error
    if (routeName === 'hasParam2') navigate(routeName, { param: '123' });
  });
});
