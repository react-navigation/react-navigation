import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type DrawerActionHelpers,
  type DrawerNavigationState,
  DrawerRouter,
  type DrawerRouterOptions,
  type ParamListBase,
  type StaticConfig,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type {
  DrawerNavigationConfig,
  DrawerNavigationEventMap,
  DrawerNavigationOptions,
  DrawerNavigationProp,
} from '../types';
import { DrawerView } from '../views/DrawerView';

type Props = DefaultNavigatorOptions<
  ParamListBase,
  string | undefined,
  DrawerNavigationState<ParamListBase>,
  DrawerNavigationOptions,
  DrawerNavigationEventMap,
  DrawerNavigationProp<ParamListBase>
> &
  DrawerRouterOptions &
  DrawerNavigationConfig;

function DrawerNavigator({
  id,
  initialRouteName,
  defaultStatus = 'closed',
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
      DrawerNavigationState<ParamListBase>,
      DrawerRouterOptions,
      DrawerActionHelpers<ParamListBase>,
      DrawerNavigationOptions,
      DrawerNavigationEventMap
    >(DrawerRouter, {
      id,
      initialRouteName,
      defaultStatus,
      backBehavior,
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
    });

  return (
    <NavigationContent>
      <DrawerView
        {...rest}
        defaultStatus={defaultStatus}
        state={state}
        descriptors={descriptors}
        navigation={navigation}
      />
    </NavigationContent>
  );
}

type DrawerNavigationList<
  ParamList extends ParamListBase,
  NavigatorID extends string | undefined,
> = {
  [RouteName in keyof ParamList]: DrawerNavigationProp<
    ParamList,
    RouteName,
    NavigatorID
  >;
};

export function createDrawerNavigator<
  ParamList extends ParamListBase,
  NavigatorID extends string | undefined = undefined,
>(): TypedNavigator<
  ParamList,
  NavigatorID,
  DrawerNavigationState<ParamList>,
  DrawerNavigationOptions,
  DrawerNavigationEventMap,
  DrawerNavigationList<ParamList, NavigatorID>,
  typeof DrawerNavigator
>;

export function createDrawerNavigator<
  ParamList extends ParamListBase,
  NavigatorID extends string | undefined,
  Config extends StaticConfig<
    ParamList,
    NavigatorID,
    DrawerNavigationState<ParamList>,
    DrawerNavigationOptions,
    DrawerNavigationEventMap,
    DrawerNavigationList<ParamList, NavigatorID>,
    typeof DrawerNavigator
  >,
>(
  config: Config
): TypedNavigator<
  ParamList,
  NavigatorID,
  DrawerNavigationState<ParamList>,
  DrawerNavigationOptions,
  DrawerNavigationEventMap,
  DrawerNavigationList<ParamList, NavigatorID>,
  typeof DrawerNavigator
> & { config: Config };

export function createDrawerNavigator(config?: any): any {
  return createNavigatorFactory(DrawerNavigator)(config);
}
