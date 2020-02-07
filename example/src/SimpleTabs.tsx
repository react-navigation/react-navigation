import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
  createMaterialBottomTabNavigator,
  NavigationMaterialBottomTabOptions,
} from 'react-navigation-material-bottom-tabs';
import PhotoGrid from './Shared/PhotoGrid';
import tabBarIcon from './Shared/tabBarIcon';

class Album extends React.Component {
  static navigationOptions: NavigationMaterialBottomTabOptions = {
    tabBarIcon: tabBarIcon('photo-album'),
  };

  render() {
    return <PhotoGrid id="album" />;
  }
}

class Library extends React.Component {
  static navigationOptions: NavigationMaterialBottomTabOptions = {
    tabBarIcon: tabBarIcon('inbox'),
  };

  render() {
    return <PhotoGrid id="library" />;
  }
}

class Favorites extends React.Component {
  static navigationOptions: NavigationMaterialBottomTabOptions = {
    tabBarIcon: tabBarIcon('favorite'),
  };

  render() {
    return <PhotoGrid id="favorites" />;
  }
}

class Purchased extends React.Component {
  static navigationOptions: NavigationMaterialBottomTabOptions = {
    tabBarIcon: tabBarIcon('shop'),
    tabBarBadge: 12,
  };

  render() {
    return <PhotoGrid id="purchased" />;
  }
}

export default createMaterialBottomTabNavigator(
  {
    Album,
    Library,
    Favorites,
    Purchased,
  },
  {
    shifting: false,
    activeColor: '#6200ee',
    inactiveColor: '#828792',
    barStyle: {
      backgroundColor: '#f8f7f9',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderStyle: 'solid',
      borderColor: '#d0cfd0',
    },
  }
);
