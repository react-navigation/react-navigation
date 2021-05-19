import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  EventArg,
  StackActions,
  StackActionHelpers,
  StackNavigationState,
  StackRouter,
  StackRouterOptions,
  ParamListBase,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';
import NativeStackView from '../views/NativeStackView';

import type {
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap,
  NativeStackNavigationConfig,
} from '../types';

export type NativeStackNavigatorProps = DefaultNavigatorOptions<NativeStackNavigationOptions> &
  StackRouterOptions &
  NativeStackNavigationConfig;

function NativeStackNavigator({
  initialRouteName,
  children,
  screenOptions,
  ...rest
}: NativeStackNavigatorProps) {
  const { state, descriptors, navigation } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackRouterOptions,
    StackActionHelpers<ParamListBase>,
    NativeStackNavigationOptions,
    NativeStackNavigationEventMap
  >(StackRouter, {
    initialRouteName,
    children,
    screenOptions,
  });

  React.useEffect(
    () =>
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
    <NativeStackView
      {...rest}
      state={state}
      navigation={navigation}
      descriptors={descriptors}
    />
  );
}

export default createNavigatorFactory<
  StackNavigationState<ParamListBase>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap,
  typeof NativeStackNavigator
>(NativeStackNavigator);
