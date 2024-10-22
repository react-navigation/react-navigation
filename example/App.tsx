import '@expo/metro-runtime'; // Necessary for Fast Refresh on Web
import './gesture-handler';

import { Assets } from '@react-navigation/elements';
import { registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';
import * as React from 'react';
import { LogBox } from 'react-native';

import { App } from './src/index';

LogBox.ignoreLogs([
  'Warning: findHostInstance_DEPRECATED is deprecated in StrictMode',
  'Warning: findNodeHandle is deprecated in StrictMode',
]);

Asset.loadAsync(Assets);

registerRootComponent(() => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
));
