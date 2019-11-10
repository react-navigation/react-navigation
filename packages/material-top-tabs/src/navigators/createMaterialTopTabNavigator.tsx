import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultNavigatorOptions,
} from '@react-navigation/core';
import {
  TabRouter,
  TabRouterOptions,
  TabNavigationState,
} from '@react-navigation/routers';
import MaterialTopTabView from '../views/MaterialTopTabView';
import {
  MaterialTopTabNavigationConfig,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
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
    TabRouterOptions,
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap
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

export default createNavigatorFactory<
  MaterialTopTabNavigationOptions,
  typeof MaterialTopTabNavigator
>(MaterialTopTabNavigator);
