import { StackRouter, createNavigator } from '@react-navigation/core';
import { createKeyboardAwareNavigator } from '@react-navigation/native';
import { Platform } from 'react-native';
import StackView from '../views/StackView/StackView';

function createStackNavigator(routeConfigMap, stackConfig = {}) {
  const router = StackRouter(routeConfigMap, stackConfig);

  // Create a navigator with StackView as the view
  let Navigator = createNavigator(StackView, router, stackConfig);
  if (!stackConfig.disableKeyboardHandling && Platform.OS !== 'web') {
    Navigator = createKeyboardAwareNavigator(Navigator, stackConfig);
  }

  return Navigator;
}

export default createStackNavigator;
