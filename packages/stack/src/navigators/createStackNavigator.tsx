import * as React from 'react';
import {
  StackRouter,
  createNavigator,
  NavigationRouteConfigMap,
  NavigationStackRouterConfig,
  CreateNavigatorConfig,
} from 'react-navigation';
import { Platform } from 'react-native';
import StackView from '../views/Stack/StackView';
import {
  NavigationStackConfig,
  NavigationStackOptions,
  NavigationStackProp,
} from '../types';
import KeyboardManager from '../views/KeyboardManager';

function createStackNavigator(
  routeConfigMap: NavigationRouteConfigMap<
    NavigationStackOptions,
    NavigationStackProp
  >,
  stackConfig: CreateNavigatorConfig<
    NavigationStackConfig,
    NavigationStackRouterConfig,
    NavigationStackOptions
  > = {}
) {
  const router = StackRouter(routeConfigMap, stackConfig);

  if (stackConfig.disableKeyboardHandling || Platform.OS === 'web') {
    return createNavigator(StackView, router, stackConfig);
  }

  return createNavigator(
    navigatorProps => (
      <KeyboardManager>
        {props => <StackView {...props} {...navigatorProps} />}
      </KeyboardManager>
    ),
    router,
    stackConfig
  );
}

export default createStackNavigator;
