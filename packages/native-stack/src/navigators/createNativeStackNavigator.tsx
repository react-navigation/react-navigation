import React from 'react';
import { createNavigator, useNavigationBuilder } from '@react-navigation/core';

import {
  StackRouter,
  StackNavigationState,
  StackRouterOptions,
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
