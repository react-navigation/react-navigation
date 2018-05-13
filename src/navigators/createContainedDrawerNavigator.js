import createNavigationContainer from '../createNavigationContainer';
import createDrawerNavigator from './createDrawerNavigator';

const DrawerNavigator = (routeConfigs, config = {}) => {
  const navigator = createDrawerNavigator(routeConfigs, config);
  return createNavigationContainer(navigator);
};

export default DrawerNavigator;
