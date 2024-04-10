import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type NavigatorTypeBagBase,
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
  UNSTABLE_getStateForRouteNamesChange,
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
      UNSTABLE_getStateForRouteNamesChange,
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
  TypeBag extends NavigatorTypeBagBase = {
    ParamList: ParamList;
    NavigatorID: NavigatorID;
    State: TabNavigationState<ParamList>;
    ScreenOptions: BottomTabNavigationOptions;
    EventMap: BottomTabNavigationEventMap;
    NavigationList: {
      [RouteName in keyof ParamList]: BottomTabNavigationProp<
        ParamList,
        RouteName,
        NavigatorID
      >;
    };
    Navigator: typeof BottomTabNavigator;
  },
  Config extends StaticConfig<TypeBag> | undefined =
    | StaticConfig<TypeBag>
    | undefined,
>(config?: Config): TypedNavigator<TypeBag, Config> {
  return createNavigatorFactory(BottomTabNavigator)(config);
}
