import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type ParamListBase,
  type StaticConfig,
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
  type TypedNavigator,
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
  string | undefined,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationProp<ParamListBase>
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

export function createMaterialTopTabNavigator<
  ParamList extends {},
  NavigatorID extends string | undefined = undefined,
>(): TypedNavigator<
  ParamList,
  NavigatorID,
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
>;

export function createMaterialTopTabNavigator<
  ParamList extends {},
  NavigatorID extends string | undefined,
  Config extends StaticConfig<
    ParamList,
    NavigatorID,
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
  >,
>(
  config: Config
): TypedNavigator<
  ParamList,
  NavigatorID,
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
> & { config: Config };

export function createMaterialTopTabNavigator(config?: any): any {
  return createNavigatorFactory(MaterialTopTabNavigator)(config);
}
