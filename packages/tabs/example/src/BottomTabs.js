import * as React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import PhotoGrid from './shared/PhotoGrid';

const tabBarIcon = name => ({ tintColor }) => (
  <MaterialIcons name={name} color={tintColor} size={24} />
);

class Album extends React.Component {
  static navigationOptions = {
    tabBarIcon: tabBarIcon('photo-album'),
  };

  render() {
    return <PhotoGrid id="album" />;
  }
}

class Library extends React.Component {
  static navigationOptions = {
    tabBarIcon: tabBarIcon('photo-library'),
  };

  render() {
    return <PhotoGrid id="library" />;
  }
}

class History extends React.Component {
  static navigationOptions = {
    tabBarIcon: tabBarIcon('history'),
  };

  render() {
    return <PhotoGrid id="history" />;
  }
}

class Cart extends React.Component {
  static navigationOptions = {
    tabBarIcon: tabBarIcon('shopping-cart'),
  };

  render() {
    return <PhotoGrid id="cart" />;
  }
}

export default createBottomTabNavigator({
  Album,
  Library,
  History,
  Cart,
});
