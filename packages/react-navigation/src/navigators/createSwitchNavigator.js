import React from 'react';
import createNavigationContainer from '../createNavigationContainer';
import createNavigator from '../navigators/createNavigator';
import SwitchRouter from '../routers/SwitchRouter';
import SwitchView from '../views/SwitchView/SwitchView';

function createSwitchNavigator(routeConfigMap, switchConfig = {}) {
  const router = SwitchRouter(routeConfigMap, switchConfig);
  const Navigator = createNavigator(SwitchView, router, switchConfig);
  return createNavigationContainer(Navigator);
}

export default createSwitchNavigator;
