import * as React from 'react';
import createNavigationContainer from '../createNavigationContainer';
import createNavigator from './createNavigator';
import StackView from '../views/StackView/StackView';
import StackRouter from '../routers/StackRouter';

function createStackNavigator(routeConfigMap, stackConfig = {}) {
  const {
    initialRouteKey,
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
  } = stackConfig;

  const stackRouterConfig = {
    initialRouteKey,
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
  };

  const router = StackRouter(routeConfigMap, stackRouterConfig);

  // Create a navigator with StackView as the view
  const Navigator = createNavigator(StackView, router, stackConfig);

  // HOC to provide the navigation prop for the top-level navigator (when the prop is missing)
  return createNavigationContainer(Navigator);
}

export default createStackNavigator;
