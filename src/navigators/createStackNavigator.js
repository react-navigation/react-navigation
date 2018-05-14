import createKeyboardAwareNavigator from './createKeyboardAwareNavigator';
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
    disableKeyboardHandling,
    getCustomActionCreators,
  } = stackConfig;

  const stackRouterConfig = {
    initialRouteKey,
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
    getCustomActionCreators,
  };

  const router = StackRouter(routeConfigMap, stackRouterConfig);

  // Create a navigator with StackView as the view
  let Navigator = createNavigator(StackView, router, stackConfig);
  if (!disableKeyboardHandling) {
    Navigator = createKeyboardAwareNavigator(Navigator);
  }

  return Navigator;
}

export default createStackNavigator;
