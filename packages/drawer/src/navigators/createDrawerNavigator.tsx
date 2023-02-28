import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  DrawerActionHelpers,
  DrawerNavigationState,
  DrawerRouter,
  DrawerRouterOptions,
  ParamListBase,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type {
  DrawerNavigationConfig,
  DrawerNavigationEventMap,
  DrawerNavigationOptions,
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
  screenListeners,
  screenOptions,
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
      screenListeners,
      screenOptions,
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

export const createDrawerNavigator = createNavigatorFactory<
  DrawerNavigationState<ParamListBase>,
  DrawerNavigationOptions,
  DrawerNavigationEventMap,
  typeof DrawerNavigator
>(DrawerNavigator);
