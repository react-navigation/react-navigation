import {
  StackRouter,
  createKeyboardAwareNavigator,
  createNavigator,
} from 'react-navigation';
import StackView from '../views/StackView/StackView';

function createStackNavigator(routeConfigMap, stackConfig = {}) {
  const router = StackRouter(routeConfigMap, stackConfig);

  // Create a navigator with StackView as the view
  let Navigator = createNavigator(StackView, router, stackConfig);
  if (!stackConfig.disableKeyboardHandling) {
    Navigator = createKeyboardAwareNavigator(Navigator, stackConfig);
  }

  return Navigator;
}

export default createStackNavigator;
