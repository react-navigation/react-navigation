import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type DrawerActionHelpers,
  type DrawerNavigationState,
  DrawerRouter,
  type DrawerRouterOptions,
  type ParamListBase,
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
  DrawerNavigationState<ParamListBase>,
  DrawerNavigationOptions,
  DrawerNavigationEventMap
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

export const createDrawerNavigator = <
  ParamList extends {},
  NavigatorID extends string | undefined = undefined,
>() =>
  createNavigatorFactory<
    ParamList,
    DrawerNavigationState<ParamList>,
    DrawerNavigationOptions,
    DrawerNavigationEventMap,
    {
      [RouteName in keyof ParamList]: DrawerNavigationProp<
        ParamList,
        RouteName,
        NavigatorID
      >;
    },
    typeof DrawerNavigator
  >(DrawerNavigator)();
