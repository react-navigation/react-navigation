import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultNavigatorOptions,
  TabRouter,
  TabRouterOptions,
  TabNavigationState,
  TabActionHelpers,
  ParamListBase,
} from '@react-navigation/native';
import MaterialTopTabView from '../views/MaterialTopTabView';
import type {
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
    TabNavigationState<ParamListBase>,
    TabRouterOptions,
    TabActionHelpers<ParamListBase>,
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
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
  typeof MaterialTopTabNavigator
>(MaterialTopTabNavigator);
