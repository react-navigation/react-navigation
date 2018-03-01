import React from 'react';
import SwitchRouter from '../routers/SwitchRouter';
import SwitchView from '../views/SwitchView/SwitchView';
import createNavigationContainer from '../createNavigationContainer';
import createNavigator from '../navigators/createNavigator';

export default (routeConfigMap, switchConfig = {}) => {
  const router = SwitchRouter(routeConfigMap, switchConfig);

  const navigator = createNavigator(router, routeConfigMap, switchConfig)(
    props => <SwitchView {...props} />
  );

  return createNavigationContainer(navigator);
};
