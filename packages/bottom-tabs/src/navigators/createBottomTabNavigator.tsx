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
  BottomTabNavigationConfig,
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
} from '../types';
import { BottomTabView } from '../views/BottomTabView';

type Props = DefaultNavigatorOptions<
  ParamListBase,
  string | undefined,
  TabNavigationState<ParamListBase>,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap,
  BottomTabNavigationProp<ParamListBase>
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

export function createBottomTabNavigator<
  ParamList extends ParamListBase,
  NavigatorID extends string | undefined = undefined,
>(): TypedNavigator<
  ParamList,
  NavigatorID,
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
>;

export function createBottomTabNavigator<
  ParamList extends ParamListBase,
  NavigatorID extends string | undefined,
  Config extends StaticConfig<
    ParamList,
    NavigatorID,
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
  >,
>(
  config: Config
): TypedNavigator<
  ParamList,
  NavigatorID,
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
> & { config: Config };

export function createBottomTabNavigator<
  ParamList extends ParamListBase,
  NavigatorID extends string | undefined,
  Config extends StaticConfig<
    ParamList,
    NavigatorID,
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
  >,
>(config?: Config): any {
  return createNavigatorFactory(BottomTabNavigator)(config);
}
