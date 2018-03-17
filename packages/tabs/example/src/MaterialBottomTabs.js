import * as React from 'react';
import { View, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialIcons } from '@expo/vector-icons';

const tabBarIcon = name => ({ tintColor }) => (
  <MaterialIcons
    style={{ backgroundColor: 'transparent' }}
    name={name}
    color={tintColor}
    size={24}
  />
);

class Album extends React.Component {
  static navigationOptions = {
    tabBarColor: '#3F51B5',
    tabBarIcon: tabBarIcon('photo-album'),
  };

  render() {
    return (
      <View>
        <Text>Album</Text>
      </View>
    );
  }
}

class Library extends React.Component {
  static navigationOptions = {
    tabBarColor: '#009688',
    tabBarIcon: tabBarIcon('photo-library'),
  };

  render() {
    return (
      <View>
        <Text>Library</Text>
      </View>
    );
  }
}

class History extends React.Component {
  static navigationOptions = {
    tabBarColor: '#795548',
    tabBarIcon: tabBarIcon('history'),
  };

  render() {
    return (
      <View>
        <Text>History</Text>
      </View>
    );
  }
}

class Cart extends React.Component {
  static navigationOptions = {
    tabBarColor: '#607D8B',
    tabBarIcon: tabBarIcon('shopping-cart'),
  };

  render() {
    return (
      <View>
        <Text>Cart</Text>
      </View>
    );
  }
}

export default createMaterialBottomTabNavigator(
  {
    Album,
    Library,
    History,
    Cart,
  },
  {
    shifting: false,
    activeTintColor: '#F44336',
  }
);
