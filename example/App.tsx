import './gesture-handler';

import { registerRootComponent } from 'expo';
import * as React from 'react';
import { LogBox, Platform } from 'react-native';
import { configure } from 'react-native-showtime';

import { UserInterfaceBug } from './src/userinterface-bug';

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

registerRootComponent(() => (
  <React.StrictMode>
    <UserInterfaceBug />
  </React.StrictMode>
));
