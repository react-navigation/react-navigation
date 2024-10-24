import 'react-native-gesture-handler';
import '@expo/metro-runtime'; // Necessary for Fast Refresh on Web

import { Assets } from '@react-navigation/elements';
import { registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';
import * as React from 'react';

import { App } from './src/index';

Asset.loadAsync(Assets);

registerRootComponent(() => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
));
