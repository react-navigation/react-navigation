import './gesture-handler';

import { setDynamicLoadingEnabled } from '@react-native-vector-icons/common';
import Feather from '@react-native-vector-icons/feather/fonts/Feather.ttf';
import Ionicons from '@react-native-vector-icons/ionicons/fonts/Ionicons.ttf';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons/fonts/MaterialDesignIcons.ttf';
import { registerRootComponent } from 'expo';
import { loadAsync } from 'expo-font';
import * as React from 'react';
import { AppRegistry, LogBox, Platform } from 'react-native';
import { configure } from 'react-native-showtime';

import { App } from './src/index';

if (Platform.OS === 'ios') {
  configure({
    size: 24,
    strokeColor: '#7b61c1',
    strokeWidth: 2,
  });
}

LogBox.ignoreLogs([
  'Open debugger to view warnings',
  'findHostInstance_DEPRECATED is deprecated in StrictMode',
  'findNodeHandle is deprecated in StrictMode',
]);

function Root() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export const fonts = {
  Feather,
  Ionicons,
  MaterialDesignIcons,
};

if (Platform.OS === 'web') {
  AppRegistry.registerComponent('main', () => Root);

  if (typeof window !== 'undefined') {
    setDynamicLoadingEnabled(false);

    loadAsync(fonts);

    const rootTag = document.getElementById('root');

    AppRegistry.runApplication('main', {
      hydrate: rootTag?.firstElementChild != null,
      initialProps: {},
      rootTag,
    });
  }
} else {
  registerRootComponent(Root);
}
