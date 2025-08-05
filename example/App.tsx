import '@expo/metro-runtime'; // Necessary for Fast Refresh on Web
import './gesture-handler';

import { Assets } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';
import * as React from 'react';
import { LogBox } from 'react-native';
import { enableScreens } from 'react-native-screens';

LogBox.ignoreLogs([
  'Warning: findHostInstance_DEPRECATED is deprecated in StrictMode',
  'Warning: findNodeHandle is deprecated in StrictMode',
]);

Asset.loadAsync(Assets);

registerRootComponent(() => (
  <React.StrictMode>
    <Navigation />
  </React.StrictMode>
));

const First = () => {
  const navigation = useNavigation();

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          navigation.navigate('Second');
        }}
      >
        Click Me
      </button>
    </div>
  );
};

const Second = () => {
  const navigation = useNavigation();

  return (
    <div>
      <h1>Second Screen</h1>
      <button
        type="button"
        onClick={() => {
          navigation.goBack();
        }}
      >
        Go Back
      </button>
    </div>
  );
};

const Stack = createStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    First,
    Second,
  },
});

const Navigation = createStaticNavigation(Stack);

enableScreens(false);
