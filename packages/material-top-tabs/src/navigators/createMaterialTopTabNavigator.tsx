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
  MaterialTopTabNavigationConfig,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationProp,
} from '../types';
import { MaterialTopTabView } from '../views/MaterialTopTabView';

type Props = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap
> &
  TabRouterOptions &
  MaterialTopTabNavigationConfig;

function MaterialTopTabNavigator({
  id,
  initialRouteName,
  backBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  ...rest
}: Props) {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      MaterialTopTabNavigationOptions,
      MaterialTopTabNavigationEventMap
    >(TabRouter, {
      id,
      initialRouteName,
      backBehavior,
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
    });

  return (
    <NavigationContent>
      <MaterialTopTabView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

export const createMaterialTopTabNavigator = <
  ParamList extends {},
  NavigatorID extends string | undefined = undefined,
>() =>
  createNavigatorFactory<
    ParamList,
    TabNavigationState<ParamList>,
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap,
    {
      [RouteName in keyof ParamList]: MaterialTopTabNavigationProp<
        ParamList,
        RouteName,
        NavigatorID
      >;
    },
    typeof MaterialTopTabNavigator
  >(MaterialTopTabNavigator)();
