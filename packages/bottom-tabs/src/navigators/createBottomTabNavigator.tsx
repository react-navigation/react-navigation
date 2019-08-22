import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigator,
  DefaultNavigatorOptions,
} from '@react-navigation/core';
import {
  TabRouter,
  TabRouterOptions,
  TabNavigationState,
} from '@react-navigation/routers';
import BottomTabView from '../views/BottomTabView';
import {
  BottomTabNavigationConfig,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap,
} from '../types';

type Props = DefaultNavigatorOptions<BottomTabNavigationOptions> &
  TabRouterOptions &
  BottomTabNavigationConfig;

function BottomTabNavigator({
  initialRouteName,
  backBehavior,
  children,
  screenOptions,
  ...rest
}: Props) {
  const { state, descriptors, navigation } = useNavigationBuilder<
    TabNavigationState,
    BottomTabNavigationOptions,
    TabRouterOptions,
    BottomTabNavigationEventMap
  >(TabRouter, {
    initialRouteName,
    backBehavior,
    children,
    screenOptions,
  });

  return (
    <BottomTabView
      {...rest}
      state={state}
      navigation={navigation}
      descriptors={descriptors}
    />
  );
}

export default createNavigator<
  BottomTabNavigationOptions,
  typeof BottomTabNavigator
>(BottomTabNavigator);
