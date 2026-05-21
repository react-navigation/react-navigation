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
    string | undefined,
    StackNavigationState<MyStackParamList>,
    MyStackOptions,
    MyStackTypeBag['EventMap']
  > &
    StackActionHelpers<MyStackParamList>;

  type MyStackNavigationList = {
    [RouteName in keyof MyStackParamList]: MyStackNavigation<RouteName>;
  };

  type InferredMyStackParamList = StaticParamList<typeof MyStack>;

  expectTypeOf<InferredMyStackParamList>().toEqualTypeOf<MyStackParamList>();

  type MyStackHomeNavigation = MyStackNavigationList['StandardStaticHome'];
  type MyStackProfileNavigation =
    MyStackNavigationList['StandardStaticProfile'];

  expectTypeOf<keyof MyStackNavigationList>().toEqualTypeOf<
    keyof MyStackParamList
  >();

  expectTypeOf<MyStackHomeNavigation['getState']>().returns.toEqualTypeOf<
    StackNavigationState<MyStackParamList>
  >();

  expectTypeOf<MyStackHomeNavigation['setOptions']>()
    .parameter(0)
    .toEqualTypeOf<Partial<MyStackOptions>>();

  expectTypeOf<MyStackProfileNavigation['setParams']>()
    .parameter(0)
    .toEqualTypeOf<Partial<{ user: string }>>();

  expectTypeOf<MyStackHomeNavigation['replace']>()
    .parameter(0)
    .toEqualTypeOf<keyof MyStackParamList>();

  expectTypeOf<MyStackHomeNavigation['replace']>().toMatchTypeOf<
    StackActionHelpers<MyStackParamList>['replace']
  >();

  const checkMyStackHomeNavigation = (navigation: MyStackHomeNavigation) => {
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

  createMyStackScreen({
    screen: TypeCheckProfileScreen,
    options: {
      title: 'Profile',
      // @ts-expect-error `subtitle` isn't a valid static screen option.
      subtitle: 'Invalid option',
    },
  });

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

  function TypeCheckProfileScreen() {
    return null;
  }

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

  createStandardNavigationFactories<MyStackTypeBag, MyStackNavigatorProps>(
    MyStackNavigator,
    StackRouter,
    // @ts-expect-error Mapped props must be keys from MyStackNavigatorProps.
    () => ({ label: 'Invalid mapped prop' })
  );

  void checkMyStackHomeNavigation;
  void invalidDynamicScreenName;
  void invalidDynamicScreenOptions;
  void dynamicNavigator;
  void invalidDynamicNavigator;
}
