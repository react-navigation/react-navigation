import {
  createNavigatorFactory,
  type EventArg,
  type ParamListBase,
  type StackActionHelpers,
  StackActions,
  type StackNavigationState,
  StackRouter,
  type StackRouterOptions,
  type StaticConfig,
  type StaticParamList,
  type StaticScreenConfig,
  type StaticScreenConfigLinking,
  type StaticScreenConfigScreen,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  NativeStackNavigatorProps,
} from '../types';
import { NativeStackView } from '../views/NativeStackView';

function NativeStackNavigator({
  initialRouteName,
  routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  router,
  ...rest
}: NativeStackNavigatorProps) {
  const { state, describe, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      StackNavigationState<ParamListBase>,
      StackRouterOptions,
      StackActionHelpers<ParamListBase>,
      NativeStackNavigationOptions,
      NativeStackNavigationEventMap
    >(StackRouter, {
      initialRouteName,
      routeNamesChangeBehavior,
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
      router,
      meta: {
        name: '@react-navigation/native-stack',
      },
    });

  React.useEffect(
    () =>
      // @ts-expect-error: there may not be a tab navigator in parent
      navigation?.addListener?.('tabPress', (e: any) => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (
            state.index > 0 &&
            isFocused &&
            !(e as EventArg<'tabPress', true>).defaultPrevented
          ) {
            // When user taps on already focused tab and we're inside the tab,
            // reset the stack to replicate native behaviour
            navigation.dispatch({
              ...StackActions.popToTop(),
              target: state.key,
            });
          }
        });
      }),
    [navigation, state.index, state.key]
  );

  return (
    <NavigationContent>
      <NativeStackView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
        describe={describe}
      />
    </NavigationContent>
  );
}

type NativeStackTypeBag<ParamList extends {}> = {
  ParamList: ParamList;
  State: StackNavigationState<ParamList>;
  ScreenOptions: NativeStackNavigationOptions;
  EventMap: NativeStackNavigationEventMap;
  NavigationList: {
    [RouteName in keyof ParamList]: NativeStackNavigationProp<
      ParamList,
      RouteName
    >;
  };
  Navigator: typeof NativeStackNavigator;
};

export function createNativeStackNavigator<
  const ParamList extends ParamListBase,
>(): TypedNavigator<NativeStackTypeBag<ParamList>, undefined>;
export function createNativeStackNavigator<
  const Config extends StaticConfig<NativeStackTypeBag<ParamListBase>>,
>(
  config: Config
): TypedNavigator<
  NativeStackTypeBag<StaticParamList<{ config: Config }>>,
  Config
>;
export function createNativeStackNavigator(config?: unknown) {
  return createNavigatorFactory(NativeStackNavigator)(config);
}

export function createNativeStackScreen<
  const Linking extends StaticScreenConfigLinking,
  const Screen extends StaticScreenConfigScreen,
>(
  config: StaticScreenConfig<
    Linking,
    Screen,
    StackNavigationState<ParamListBase>,
    NativeStackNavigationOptions,
    NativeStackNavigationEventMap,
    NativeStackNavigationProp<ParamListBase>
  >
) {
  return config;
}
