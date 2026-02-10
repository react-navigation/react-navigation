import '@expo/metro-runtime'; // Necessary for Fast Refresh on Web
import './gesture-handler';

import { registerRootComponent } from 'expo';
import * as React from 'react';
import { LogBox } from 'react-native';

import { App } from './src/index';

LogBox.ignoreLogs([
  'Open debugger to view warnings',
  'findHostInstance_DEPRECATED is deprecated in StrictMode',
  'findNodeHandle is deprecated in StrictMode',
]);

registerRootComponent(() => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
));
