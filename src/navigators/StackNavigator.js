/* @flow */

import React from 'react';
import createNavigationContainer from '../createNavigationContainer';
import createNavigator from './createNavigator';
import CardStackTransitioner from '../views/CardStackTransitioner';
import StackRouter from '../routers/StackRouter';
import NavigatorTypes from './NavigatorTypes';

import type {
  NavigationStackRouterConfig,
  NavigationStackViewConfig,
  NavigationRouteConfigMap,
} from '../TypeDefinition';

export type StackNavigatorConfig = {
  containerOptions?: void,
} & NavigationStackViewConfig &
  NavigationStackRouterConfig;

export default (
  routeConfigMap: NavigationRouteConfigMap,
  stackConfig: StackNavigatorConfig = {}
) => {
  const {
    initialRouteName,
    initialRouteParams,
    paths,
    headerMode,
    mode,
    cardStyle,
    transitionConfig,
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

  const navigator = createNavigator(
    router,
    routeConfigMap,
    stackConfig,
    NavigatorTypes.STACK
  )((props: *) => (
    <CardStackTransitioner
      {...props}
      headerMode={headerMode}
      mode={mode}
      cardStyle={cardStyle}
      transitionConfig={transitionConfig}
      onTransitionStart={onTransitionStart}
      onTransitionEnd={onTransitionEnd}
    />
  ));

  return createNavigationContainer(navigator, stackConfig.containerOptions);
};
