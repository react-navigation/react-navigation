import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigator,
  DefaultNavigatorOptions,
} from '@navigation-ex/core';
import {
  TabRouter,
  TabRouterOptions,
  TabNavigationState,
} from '@navigation-ex/routers';

import MaterialBottomTabView from '../views/MaterialBottomTabView';
import {
  MaterialBottomTabNavigationConfig,
  MaterialBottomTabNavigationOptions,
} from '../types';

type Props = DefaultNavigatorOptions<MaterialBottomTabNavigationOptions> &
  TabRouterOptions &
  MaterialBottomTabNavigationConfig;

function MaterialBottomTabNavigator({
  initialRouteName,
  backBehavior,
  children,
  screenOptions,
  ...rest
}: Props) {
  const { state, descriptors, navigation } = useNavigationBuilder<
    TabNavigationState,
    MaterialBottomTabNavigationOptions,
    TabRouterOptions
  >(TabRouter, {
    initialRouteName,
    backBehavior,
    children,
    screenOptions,
  });

  return (
    <MaterialBottomTabView
      {...rest}
      state={state}
      navigation={navigation}
      descriptors={descriptors}
    />
  );
}

export default createNavigator<
  MaterialBottomTabNavigationOptions,
  typeof MaterialBottomTabNavigator
>(MaterialBottomTabNavigator);
