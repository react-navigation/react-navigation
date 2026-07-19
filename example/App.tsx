import './gesture-handler';

import { setDynamicLoadingEnabled } from '@react-native-vector-icons/common';
import FeatherFont from '@react-native-vector-icons/feather/fonts/Feather.ttf';
import IoniconsFont from '@react-native-vector-icons/ionicons/fonts/Ionicons.ttf';
import MaterialDesignIconsFont from '@react-native-vector-icons/material-design-icons/fonts/MaterialDesignIcons.ttf';
import MaterialIconsFont from '@react-native-vector-icons/material-icons/fonts/MaterialIcons.ttf';
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

export function loadFonts() {
  return loadAsync({
    Feather: FeatherFont,
    Ionicons: IoniconsFont,
    MaterialDesignIcons: MaterialDesignIconsFont,
    'MaterialIcons-Regular': MaterialIconsFont,
  });
}

if (Platform.OS === 'web') {
  AppRegistry.registerComponent('main', () => Root);

  if (typeof window !== 'undefined') {
    setDynamicLoadingEnabled(false);

    loadFonts();

    AppRegistry.runApplication('main', {
      hydrate: true,
      initialProps: {},
      rootTag: document.getElementById('root'),
    });
  }
} else {
  registerRootComponent(Root);
}
