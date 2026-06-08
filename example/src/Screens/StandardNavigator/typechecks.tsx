import {
  createStandardNavigationFactories,
  type EventArg,
  type NavigationProp,
  type StackActionHelpers,
  type StackNavigationState,
  StackRouter,
  type StaticParamList,
} from '@react-navigation/native';
import { expectTypeOf } from 'expect-type';
import type * as React from 'react';

import {
  createMyStackNavigator,
  createMyStackScreen,
  type MyStackTypeBag,
} from './createMyStackNavigator';
import {
  MyStackNavigator,
  type MyStackNavigatorProps,
  type MyStackOptions,
} from './MyStackNavigator';
import { MyStack } from './MyStackStatic';

{
  type MyStackParamList = {
    StandardStaticHome: undefined;
    StandardStaticProfile: { user: string };
    StandardStaticDetails: { section: string };
  };

  type MyStackNavigation<
    RouteName extends keyof MyStackParamList = keyof MyStackParamList,
  > = NavigationProp<
    MyStackParamList,
    RouteName,
    StackNavigationState<MyStackParamList>,
    MyStackOptions,
    MyStackTypeBag['EventMap'],
    StackActionHelpers<MyStackParamList>
  >;

  function TypeCheckProfileScreen() {
    return null;
  }

  /**
   * Infer param list from the static config
   */
  type InferredMyStackParamList = StaticParamList<typeof MyStack>;

  expectTypeOf<InferredMyStackParamList>().toEqualTypeOf<MyStackParamList>();

  /**
   * Custom screen options are exposed through `setOptions`
   */
  expectTypeOf<MyStackNavigation['setOptions']>()
    .parameter(0)
    .toEqualTypeOf<Partial<MyStackOptions>>();

  /**
   * Custom options & events accepted on the navigation prop in real use
   */
  const checkMyStackHomeNavigation = (
    navigation: MyStackNavigation<'StandardStaticHome'>
  ) => {
    navigation.replace('StandardStaticProfile', { user: 'Satya' });
    navigation.setOptions({ title: 'Home', rightButtonTitle: 'Press me' });

    // @ts-expect-error `subtitle` isn't a valid option for MyStack.
    navigation.setOptions({ subtitle: 'Invalid option' });

    navigation.addListener('rightButtonPress', (event) => {
      expectTypeOf(event).toEqualTypeOf<
        EventArg<'rightButtonPress', true, { count: number }>
      >();
    });
  };

  /**
   * `createMyStackScreen` accepts custom `options` (object form)
   */
  createMyStackScreen({
    screen: TypeCheckProfileScreen,
    options: { title: 'Profile', rightButtonTitle: 'Press me' },
  });

  createMyStackScreen({
    screen: TypeCheckProfileScreen,
    options: {
      title: 'Profile',
      // @ts-expect-error `subtitle` isn't a valid static screen option.
      subtitle: 'Invalid option',
    },
  });

  /**
   * `createMyStackScreen` accepts custom `options` (function form)
   */
  createMyStackScreen({
    screen: TypeCheckProfileScreen,
    options: ({ route, navigation }) => {
      expectTypeOf(route.name).toEqualTypeOf<string>();
      expectTypeOf(navigation.setOptions)
        .parameter(0)
        .toEqualTypeOf<Partial<MyStackOptions>>();

      return { title: 'Profile', rightButtonTitle: 'Press me' };
    },
  });

  createMyStackScreen({
    screen: TypeCheckProfileScreen,
    // @ts-expect-error `subtitle` isn't a valid static screen option.
    options: () => ({ subtitle: 'Invalid option' }),
  });

  /**
   * `createMyStackScreen` accepts custom event `listeners` (object form)
   */
  createMyStackScreen({
    screen: TypeCheckProfileScreen,
    listeners: {
      rightButtonPress: (event) => {
        expectTypeOf(event).toEqualTypeOf<
          EventArg<'rightButtonPress', true, { count: number }>
        >();
      },
    },
  });

  /**
   * `createMyStackScreen` accepts custom event `listeners` (function form)
   */
  createMyStackScreen({
    screen: TypeCheckProfileScreen,
    listeners: ({ navigation }) => {
      expectTypeOf(navigation.setOptions)
        .parameter(0)
        .toEqualTypeOf<Partial<MyStackOptions>>();

      return {
        rightButtonPress: (event) => {
          expectTypeOf(event).toEqualTypeOf<
            EventArg<'rightButtonPress', true, { count: number }>
          >();
        },
      };
    },
  });

  /**
   * Static navigator accepts `screenOptions` typed as `MyStackOptions` (object form)
   */
  createMyStackNavigator({
    screens: { StandardStaticHome: TypeCheckProfileScreen },
    screenOptions: { title: 'Default title' },
  });

  createMyStackNavigator({
    screens: { StandardStaticHome: TypeCheckProfileScreen },
    screenOptions: {
      // @ts-expect-error `subtitle` isn't a valid option for MyStack.
      subtitle: 'Invalid option',
    },
  });

  /**
   * Static navigator accepts `screenOptions` (function form)
   */
  createMyStackNavigator({
    screens: { StandardStaticHome: TypeCheckProfileScreen },
    screenOptions: ({ navigation }) => {
      expectTypeOf(navigation.setOptions)
        .parameter(0)
        .toEqualTypeOf<Partial<MyStackOptions>>();

      return { title: 'Default title' };
    },
  });

  /**
   * Static navigator accepts `screenListeners` for custom events (object form)
   */
  createMyStackNavigator({
    screens: { StandardStaticHome: TypeCheckProfileScreen },
    screenListeners: {
      rightButtonPress: (event) => {
        expectTypeOf(event).toEqualTypeOf<
          EventArg<'rightButtonPress', true, { count: number }>
        >();
      },
    },
  });

  /**
   * Static navigator accepts `screenListeners` for custom events (function form)
   */
  createMyStackNavigator({
    screens: { StandardStaticHome: TypeCheckProfileScreen },
    screenListeners: ({ navigation }) => {
      expectTypeOf(navigation.setOptions)
        .parameter(0)
        .toEqualTypeOf<Partial<MyStackOptions>>();

      return {
        rightButtonPress: (event) => {
          expectTypeOf(event).toEqualTypeOf<
            EventArg<'rightButtonPress', true, { count: number }>
          >();
        },
      };
    },
  });

  /**
   * Dynamic factory: `createMyStackNavigator<ParamList>()`
   */
  type DynamicMyStackParamList = {
    DynamicHome: undefined;
    DynamicProfile: { user: string };
    DynamicDetails: { section: string };
  };

  const DynamicMyStack = createMyStackNavigator<DynamicMyStackParamList>();

  type DynamicMyStackNavigatorProps = React.ComponentProps<
    typeof DynamicMyStack.Navigator
  >;

  expectTypeOf<
    DynamicMyStackNavigatorProps['initialRouteName']
  >().toEqualTypeOf<keyof DynamicMyStackParamList | undefined>();

  expectTypeOf(DynamicMyStack.Screen).parameter(0).toExtend<{
    name?: keyof DynamicMyStackParamList;
  }>();

  /**
   * Dynamic `<Navigator>` `screenOptions` accepts `MyStackOptions` (object + function form)
   */
  const dynamicScreenOptions: DynamicMyStackNavigatorProps['screenOptions'] = {
    title: 'Default title',
    // @ts-expect-error `subtitle` isn't a valid option for MyStack.
    subtitle: 'Invalid option',
  };

  const dynamicScreenOptionsFn: DynamicMyStackNavigatorProps['screenOptions'] =
    ({ navigation }) => {
      expectTypeOf(navigation.setOptions)
        .parameter(0)
        .toEqualTypeOf<Partial<MyStackOptions>>();

      return { title: 'Default title' };
    };

  /**
   * Dynamic `<Navigator>` `screenListeners` accepts custom events (object + function form)
   */
  const dynamicScreenListeners: DynamicMyStackNavigatorProps['screenListeners'] =
    {
      rightButtonPress: (event) => {
        expectTypeOf(event).toEqualTypeOf<
          EventArg<'rightButtonPress', true, { count: number }>
        >();

        // @ts-expect-error rightButtonPress doesn't include routeKey.
        void event.data.routeKey;
      },
    };

  const dynamicScreenListenersFn: DynamicMyStackNavigatorProps['screenListeners'] =
    ({ navigation }) => {
      expectTypeOf(navigation.setOptions)
        .parameter(0)
        .toEqualTypeOf<Partial<MyStackOptions>>();

      return {
        rightButtonPress: (event) => {
          expectTypeOf(event).toEqualTypeOf<
            EventArg<'rightButtonPress', true, { count: number }>
          >();
        },
      };
    };

  /**
   * Dynamic `<Screen>` accepts custom `options` (function form) and `listeners` (object form)
   */
  const dynamicScreen = (
    <DynamicMyStack.Screen
      name="DynamicProfile"
      component={TypeCheckProfileScreen}
      options={({ navigation, route }) => {
        expectTypeOf(route.params).toEqualTypeOf<Readonly<{ user: string }>>();

        expectTypeOf(navigation.setOptions)
          .parameter(0)
          .toEqualTypeOf<Partial<MyStackOptions>>();

        return { title: route.params.user, rightButtonTitle: 'Press me' };
      }}
      listeners={{
        rightButtonPress: (event) => {
          expectTypeOf(event).toEqualTypeOf<
            EventArg<'rightButtonPress', true, { count: number }>
          >();
        },
      }}
    />
  );

  /**
   * Dynamic `<Screen>` accepts custom `options` (object form) and `listeners` (function form)
   */
  const dynamicScreenObjectForm = (
    <DynamicMyStack.Screen
      name="DynamicProfile"
      component={TypeCheckProfileScreen}
      options={{ title: 'Profile', rightButtonTitle: 'Press me' }}
      listeners={({ navigation }) => {
        expectTypeOf(navigation.setOptions)
          .parameter(0)
          .toEqualTypeOf<Partial<MyStackOptions>>();

        return {
          rightButtonPress: (event) => {
            expectTypeOf(event).toEqualTypeOf<
              EventArg<'rightButtonPress', true, { count: number }>
            >();
          },
        };
      }}
    />
  );

  const invalidDynamicScreenName = (
    <DynamicMyStack.Screen
      // @ts-expect-error This route isn't in DynamicMyStackParamList.
      name="Unknown"
      component={TypeCheckProfileScreen}
    />
  );

  const invalidDynamicScreenOptions = (
    <DynamicMyStack.Screen
      name="DynamicProfile"
      component={TypeCheckProfileScreen}
      // @ts-expect-error `subtitle` isn't a valid dynamic screen option.
      options={{ subtitle: 'Invalid option' }}
    />
  );

  const dynamicNavigator = (
    <DynamicMyStack.Navigator
      initialRouteName="DynamicHome"
      screenOptions={dynamicScreenOptionsFn}
      screenListeners={dynamicScreenListeners}
    >
      {dynamicScreen}
    </DynamicMyStack.Navigator>
  );

  const invalidDynamicNavigator = (
    <DynamicMyStack.Navigator
      // @ts-expect-error `label` isn't a valid navigator prop.
      label="Dynamic Standard Navigation"
    >
      {dynamicScreen}
    </DynamicMyStack.Navigator>
  );

  /**
   * `createStandardNavigationFactories` validates mapper return against `NavigatorProps`
   */
  createStandardNavigationFactories<MyStackTypeBag, MyStackNavigatorProps>(
    MyStackNavigator,
    StackRouter,
    ({ state }) => ({
      preloadedCount: state.routes.slice(state.index + 1).length,
    })
  );

  createStandardNavigationFactories<MyStackTypeBag, MyStackNavigatorProps>(
    MyStackNavigator,
    StackRouter,
    // @ts-expect-error Mapped props must be keys from MyStackNavigatorProps.
    () => ({ label: 'Invalid mapped prop' })
  );

  void checkMyStackHomeNavigation;
  void dynamicScreenOptions;
  void dynamicScreenListenersFn;
  void dynamicScreenObjectForm;
  void invalidDynamicScreenName;
  void invalidDynamicScreenOptions;
  void dynamicNavigator;
  void invalidDynamicNavigator;
}
