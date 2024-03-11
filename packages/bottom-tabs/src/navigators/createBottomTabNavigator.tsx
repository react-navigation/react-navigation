import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type ParamListBase,
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type {
  BottomTabNavigationConfig,
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
} from '../types';
import { BottomTabView } from '../views/BottomTabView';

type Props = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap
> &
  TabRouterOptions &
  BottomTabNavigationConfig;

function BottomTabNavigator({
  id,
  initialRouteName,
  backBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  sceneContainerStyle,
  ...rest
}: Props) {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      BottomTabNavigationOptions,
      BottomTabNavigationEventMap
    >(TabRouter, {
      id,
      initialRouteName,
      backBehavior,
      children,
      layout,
      screenListeners,
      screenOptions,
    });

  return (
    <NavigationContent>
      <BottomTabView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
        sceneContainerStyle={sceneContainerStyle}
      />
    </NavigationContent>
  );
}

export const createBottomTabNavigator = <
  ParamList extends {},
  NavigatorID extends string | undefined = undefined,
>() =>
  createNavigatorFactory<
    ParamList,
    TabNavigationState<ParamList>,
    BottomTabNavigationOptions,
    BottomTabNavigationEventMap,
    {
      [RouteName in keyof ParamList]: BottomTabNavigationProp<
        ParamList,
        RouteName,
        NavigatorID
      >;
    },
    typeof BottomTabNavigator
  >(BottomTabNavigator)();
