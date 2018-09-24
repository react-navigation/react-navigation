import React from 'react';
import switchRouter from '../routers/SwitchRouter';
import SwitchView from '../views/SwitchView/SwitchView';
import createNavigationContainer from '../createNavigationContainer';
import createNavigator from '../navigators/createNavigator';

export default (routeConfigMap, switchConfig = {}) => {
  const router = switchRouter(routeConfigMap, switchConfig);

  const navigator = createNavigator(router, routeConfigMap, switchConfig)(
    props => <SwitchView {...props} />
  );

  return createNavigationContainer(navigator);
};
