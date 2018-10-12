import { createNavigationContainer } from '@react-navigation/native';
import { createSwitchNavigator } from '@react-navigation/core';

const SwitchNavigator = (routeConfigs, config = {}) => {
  const navigator = createSwitchNavigator(routeConfigs, config);
  return createNavigationContainer(navigator);
};

export default SwitchNavigator;
