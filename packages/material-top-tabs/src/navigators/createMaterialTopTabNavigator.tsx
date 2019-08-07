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
import MaterialTopTabView from '../views/MaterialTopTabView';
import {
  MaterialTopTabNavigationConfig,
  MaterialTopTabNavigationOptions,
} from '../types';

type Props = DefaultNavigatorOptions<MaterialTopTabNavigationOptions> &
  TabRouterOptions &
  MaterialTopTabNavigationConfig;

function MaterialTopTabNavigator({
  initialRouteName,
  backBehavior,
  children,
  screenOptions,
  ...rest
}: Props) {
  const { state, descriptors, navigation } = useNavigationBuilder<
    TabNavigationState,
    MaterialTopTabNavigationOptions,
    TabRouterOptions
  >(TabRouter, {
    initialRouteName,
    backBehavior,
    children,
    screenOptions,
  });

  return (
    <MaterialTopTabView
      {...rest}
      state={state}
      navigation={navigation}
      descriptors={descriptors}
    />
  );
}

export default createNavigator<
  MaterialTopTabNavigationOptions,
  typeof MaterialTopTabNavigator
>(MaterialTopTabNavigator);
