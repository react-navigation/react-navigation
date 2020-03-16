import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultNavigatorOptions,
  TabRouter,
  TabRouterOptions,
  TabNavigationState,
} from '@react-navigation/native';
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
    TabRouterOptions,
    BottomTabNavigationOptions,
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

export default createNavigatorFactory<
  TabNavigationState,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap,
  typeof BottomTabNavigator
>(BottomTabNavigator);
