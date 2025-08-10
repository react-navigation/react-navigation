import '@expo/metro-runtime'; // Necessary for Fast Refresh on Web
import './gesture-handler';

import { Assets, Button, Text } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';
import * as React from 'react';
import { LogBox, SafeAreaView, View } from 'react-native';
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
    <SafeAreaView>
      <Button
        onPress={() => {
          navigation.navigate('Second');
        }}
      >
        Click Me
      </Button>
    </SafeAreaView>
  );
};

const Second = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <Text>Second Screen</Text>
      <Button
        onPress={() => {
          navigation.goBack();
        }}
      >
        Go Back
      </Button>
    </SafeAreaView>
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
