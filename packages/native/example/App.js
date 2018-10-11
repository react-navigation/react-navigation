import React from 'react';
import Expo from 'expo';
import { View, Text } from 'react-native';
import { createNavigationContainer } from '@react-navigation/native';
import { createSwitchNavigator } from '@react-navigation/core';

class Home extends React.Component {
  static navigationOptions = {
    title: 'Examples',
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>Examples</Text>
      </View>
    );
  }
}

const AppNavigator = createSwitchNavigator({
  Home,
  Profile: Home,
});

const App = createNavigationContainer(AppNavigator);

Expo.registerRootComponent(App);
