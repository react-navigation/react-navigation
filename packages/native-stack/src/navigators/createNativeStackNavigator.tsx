import React from 'react';
import {
  createNavigator,
  useNavigationBuilder,
  EventArg,
} from '@react-navigation/core';

import {
  StackRouter,
  StackNavigationState,
  StackRouterOptions,
  StackActions,
} from '@react-navigation/routers';

import {
  screensEnabled,
  // eslint-disable-next-line import/no-unresolved
} from 'react-native-screens';
import StackView from '../views/StackView';
import {
  NativeStackNavigatorProps,
  NativeStackNavigationOptions,
} from '../types';

function NativeStackNavigator(props: NativeStackNavigatorProps) {
  if (!screensEnabled()) {
    throw new Error(
      'Native stack is only available if React Native Screens is enabled.'
    );
  }

  const { initialRouteName, children, screenOptions, ...rest } = props;
  const { state, descriptors, navigation } = useNavigationBuilder<
    StackNavigationState,
    StackRouterOptions,
    NativeStackNavigationOptions,
    {}
  >(StackRouter, {
    initialRouteName,
    children,
    screenOptions,
  });

  React.useEffect(
    () =>
      navigation.addListener &&
      navigation.addListener('tabPress', (e: EventArg<'tabPress'>) => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (state.index > 0 && isFocused && !e.defaultPrevented) {
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
    <StackView
      state={state}
      navigation={navigation}
      descriptors={descriptors}
      {...rest}
    />
  );
}

export default createNavigator<
  NativeStackNavigationOptions,
  typeof NativeStackNavigator
>(NativeStackNavigator);
