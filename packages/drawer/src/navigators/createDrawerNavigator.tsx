import * as React from 'react';
import {
  createNavigatorFactory,
  useNavigationBuilder,
  DefaultNavigatorOptions,
  DrawerNavigationState,
  DrawerRouterOptions,
  DrawerRouter,
} from '@react-navigation/native';

import DrawerView from '../views/DrawerView';
import {
  DrawerNavigationOptions,
  DrawerNavigationConfig,
  DrawerNavigationEventMap,
} from '../types';

type Props = DefaultNavigatorOptions<DrawerNavigationOptions> &
  DrawerRouterOptions &
  DrawerNavigationConfig;

function DrawerNavigator({
  initialRouteName,
  openByDefault,
  backBehavior,
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
    openByDefault,
    backBehavior,
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
  DrawerNavigationState,
  DrawerNavigationOptions,
  DrawerNavigationEventMap,
  typeof DrawerNavigator
>(DrawerNavigator);
