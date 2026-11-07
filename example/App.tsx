import '@expo/metro-runtime'; // Necessary for Fast Refresh on Web

import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox } from 'react-native';

import { YouTubeTabs } from './src/Screens/YouTubeTabs';

LogBox.ignoreLogs([
  'Open debugger to view warnings',
]);

registerRootComponent(() => (
  <NavigationContainer
    doubleBackToExit
    onReady={() => {
      SplashScreen.hideAsync();
    }}
  >
    <YouTubeTabs />
  </NavigationContainer>
));
