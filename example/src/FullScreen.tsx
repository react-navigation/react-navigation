import * as React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';

class Screen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  render() {
    return <View style={{ flex: 1, backgroundColor: 'red' }} />;
  }
}

export default createStackNavigator({ Screen });
