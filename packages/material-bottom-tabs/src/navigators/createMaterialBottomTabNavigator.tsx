import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultNavigatorOptions,
  TabRouter,
  TabRouterOptions,
  TabNavigationState,
} from '@react-navigation/native';

import MaterialBottomTabView from '../views/MaterialBottomTabView';
import {
  MaterialBottomTabNavigationConfig,
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationEventMap,
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
    TabRouterOptions,
    MaterialBottomTabNavigationOptions,
    MaterialBottomTabNavigationEventMap
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

export default createNavigatorFactory<
  TabNavigationState,
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationEventMap,
  typeof MaterialBottomTabNavigator
>(MaterialBottomTabNavigator);
