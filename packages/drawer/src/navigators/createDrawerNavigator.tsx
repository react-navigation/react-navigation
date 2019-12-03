import * as React from 'react';
import {
  createNavigatorFactory,
  useNavigationBuilder,
  DefaultNavigatorOptions,
} from '@react-navigation/core';
import {
  DrawerNavigationState,
  DrawerRouterOptions,
  DrawerRouter,
} from '@react-navigation/routers';

import DrawerView from '../views/DrawerView';
import {
  DrawerNavigationOptions,
  DrawerNavigationConfig,
  DrawerNavigationEventMap,
} from '../types';

type Props = DefaultNavigatorOptions<DrawerNavigationOptions> &
  DrawerRouterOptions &
  Partial<DrawerNavigationConfig>;

function DrawerNavigator({
  initialRouteName,
  children,
  screenOptions,
  ...rest
}: Props) {
  const { state, descriptors, navigation } = useNavigationBuilder<
    DrawerNavigationState,
    DrawerRouterOptions,
    DrawerNavigationOptions,
    DrawerNavigationEventMap
  >(DrawerRouter, {
    initialRouteName,
    children,
    screenOptions,
  });

  return (
    <DrawerView
      {...rest}
      state={state}
      descriptors={descriptors}
      navigation={navigation}
    />
  );
}

export default createNavigatorFactory<
  DrawerNavigationOptions,
  typeof DrawerNavigator
>(DrawerNavigator);
