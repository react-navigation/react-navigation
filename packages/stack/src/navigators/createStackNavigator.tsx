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
  type TypedNavigator,
  useLocale,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type {
  StackNavigationEventMap,
  StackNavigationOptions,
  StackNavigationProp,
  StackNavigatorProps,
} from '../types';
import { StackView } from '../views/Stack/StackView';

function StackNavigator({
  initialRouteName,
  UNSTABLE_routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  router,
  ...rest
}: StackNavigatorProps) {
  const { direction } = useLocale();

  const { state, describe, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      StackNavigationState<ParamListBase>,
      StackRouterOptions,
      StackActionHelpers<ParamListBase>,
      StackNavigationOptions,
      StackNavigationEventMap
    >(StackRouter, {
      initialRouteName,
      UNSTABLE_routeNamesChangeBehavior,
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
      router,
    });

  React.useEffect(
    () =>
      // @ts-expect-error: there may not be a tab navigator in parent
      navigation.addListener?.('tabPress', (e) => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (
            state.index > 0 &&
            isFocused &&
            !(e as unknown as EventArg<'tabPress', true>).defaultPrevented
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
      <StackView
        {...rest}
        direction={direction}
        state={state}
        describe={describe}
        descriptors={descriptors}
        navigation={navigation}
      />
    </NavigationContent>
  );
}

type StackTypeBag<ParamList extends {}> = {
  ParamList: ParamList;
  State: StackNavigationState<ParamList>;
  ScreenOptions: StackNavigationOptions;
  EventMap: StackNavigationEventMap;
  NavigationList: {
    [RouteName in keyof ParamList]: StackNavigationProp<ParamList, RouteName>;
  };
  Navigator: typeof StackNavigator;
};

export function createStackNavigator<
  const ParamList extends ParamListBase,
>(): TypedNavigator<StackTypeBag<ParamList>, undefined>;
export function createStackNavigator<
  const Config extends StaticConfig<StackTypeBag<ParamListBase>>,
>(
  config: Config
): TypedNavigator<StackTypeBag<StaticParamList<{ config: Config }>>, Config>;
export function createStackNavigator(config?: unknown) {
  return createNavigatorFactory(StackNavigator)(config);
}

export function createStackScreen<
  const Screen extends React.ComponentType<any>,
>(
  config: StaticScreenConfig<
    Screen,
    StackNavigationState<ParamListBase>,
    StackNavigationOptions,
    StackNavigationEventMap,
    StackNavigationProp<ParamListBase>
  >
) {
  return config;
}
