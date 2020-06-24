import * as React from 'react';
import {
  StackRouter,
  createNavigator,
  NavigationRouteConfigMap,
  NavigationStackRouterConfig,
  CreateNavigatorConfig,
} from 'react-navigation';
import StackView from '../views/StackView';
import type {
  StackNavigationConfig,
  StackNavigationOptions,
  StackNavigationProp,
} from '../vendor/types';

function createStackNavigator(
  routeConfigMap: NavigationRouteConfigMap<
    StackNavigationOptions,
    StackNavigationProp
  >,
  stackConfig: CreateNavigatorConfig<
    StackNavigationConfig,
    NavigationStackRouterConfig,
    StackNavigationOptions,
    StackNavigationProp
  > = {}
) {
  const router = StackRouter(routeConfigMap, stackConfig);

  return createNavigator(
    // TODO: don't have time to fix it right now
    // @ts-ignore
    (navigatorProps) => <StackView {...navigatorProps} />,
    router,
    stackConfig
  );
}

export default createStackNavigator;
