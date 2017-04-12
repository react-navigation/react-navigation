/* @flow */

import React from 'react';
import createNavigationContainer from '../createNavigationContainer';
import createNavigator from './createNavigator';
import CardStackTransitioner from '../views/CardStackTransitioner';
import StackRouter from '../routers/StackRouter';
import NavigatorTypes from './NavigatorTypes';

import type {
  NavigationContainerConfig,
  NavigationStackRouterConfig,
  NavigationStackViewConfig,
  NavigationRouteConfigMap,
} from '../TypeDefinition';

export type StackNavigatorConfig =
  & NavigationContainerConfig
  & NavigationStackViewConfig
  & NavigationStackRouterConfig;

export default (routeConfigMap: NavigationRouteConfigMap, stackConfig: StackNavigatorConfig = {}) => {
  const {
    containerOptions,
    initialRouteName,
    initialRouteParams,
    paths,
    headerComponent,
    headerMode,
    mode,
    cardStyle,
    onTransitionStart,
    onTransitionEnd,
    navigationOptions,
  } = stackConfig;
  const stackRouterConfig = {
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
  };
  const router = StackRouter(routeConfigMap, stackRouterConfig);
  return createNavigationContainer(createNavigator(router, routeConfigMap, stackConfig, NavigatorTypes.STACK)(props => (
    <CardStackTransitioner
      {...props}
      headerComponent={headerComponent}
      headerMode={headerMode}
      mode={mode}
      cardStyle={cardStyle}
      onTransitionStart={onTransitionStart}
      onTransitionEnd={onTransitionEnd}
    />
  )), containerOptions);
};
