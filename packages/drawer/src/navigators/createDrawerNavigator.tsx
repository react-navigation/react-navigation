import * as React from 'react';
import {
  createNavigator,
  useNavigationBuilder,
  DefaultNavigatorOptions,
} from '@react-navigation/core';
import {
  DrawerNavigationState,
  DrawerRouterOptions,
  DrawerRouter,
} from '@react-navigation/routers';

import DrawerView from '../views/DrawerView';
import { DrawerNavigationOptions, DrawerNavigationConfig } from '../types';

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
    DrawerNavigationOptions,
    DrawerRouterOptions
  >(DrawerRouter, {
    initialRouteName,
    children,
    screenOptions,
  });

  return (
    <DrawerView
      state={state}
      descriptors={descriptors}
      navigation={navigation}
      {...rest}
    />
  );
}

export default createNavigator<DrawerNavigationOptions, typeof DrawerNavigator>(
  DrawerNavigator
);
