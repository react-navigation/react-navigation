import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type NavigationListBase,
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
  ParamList extends ParamListBase,
  NavigatorID extends string | undefined = undefined,
  NavigationList extends NavigationListBase<ParamList> = {
    [RouteName in keyof ParamList]: MaterialTopTabNavigationProp<
      ParamList,
      RouteName,
      NavigatorID
    >;
  },
  Config extends StaticConfig<
    ParamList,
    NavigatorID,
    TabNavigationState<ParamList>,
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap,
    NavigationList,
    typeof MaterialTopTabNavigator
  > = StaticConfig<
    ParamList,
    NavigatorID,
    TabNavigationState<ParamList>,
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap,
    NavigationList,
    typeof MaterialTopTabNavigator
  >,
>(
  config?: Config
): TypedNavigator<
  ParamList,
  NavigatorID,
  TabNavigationState<ParamList>,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
  NavigationList,
  typeof MaterialTopTabNavigator
> &
  (typeof config extends undefined ? {} : { config: Config }) {
  return createNavigatorFactory(MaterialTopTabNavigator)(config);
}
