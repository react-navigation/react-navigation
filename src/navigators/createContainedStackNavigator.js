import createNavigationContainer from '../createNavigationContainer';
import createStackNavigator from './createStackNavigator';

const StackNavigator = (routeConfigs, config = {}) => {
  const navigator = createStackNavigator(routeConfigs, config);
  return createNavigationContainer(navigator);
};

export default StackNavigator;
