import { createNavigationContainer } from 'react-navigation';
import createStackNavigator from './createStackNavigator';

const createContainedStackNavigator = (routeConfigs, config = {}) => {
  const navigator = createStackNavigator(routeConfigs, config);
  return createNavigationContainer(navigator);
};

export default createContainedStackNavigator;
