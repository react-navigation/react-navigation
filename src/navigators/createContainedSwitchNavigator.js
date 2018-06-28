import createNavigationContainer from '../createNavigationContainer';
import createSwitchNavigator from './createSwitchNavigator';

const SwitchNavigator = (routeConfigs, config = {}) => {
  const navigator = createSwitchNavigator(routeConfigs, config);
  return createNavigationContainer(navigator);
};

export default SwitchNavigator;
