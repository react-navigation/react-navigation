import * as React from 'react';
import {
  createMaterialBottomTabNavigator,
  NavigationMaterialBottomTabOptions,
} from 'react-navigation-material-bottom-tabs';
import PhotoGrid from './Shared/PhotoGrid';
import tabBarIcon from './Shared/tabBarIcon';

class Album extends React.Component {
  static navigationOptions: NavigationMaterialBottomTabOptions = {
    tabBarColor: '#6200ee',
    tabBarIcon: tabBarIcon('photo-album'),
  };

  render() {
    return <PhotoGrid id="album" />;
  }
}

class Library extends React.Component {
  static navigationOptions: NavigationMaterialBottomTabOptions = {
    tabBarColor: '#2962ff',
    tabBarIcon: tabBarIcon('inbox'),
  };

  render() {
    return <PhotoGrid id="library" />;
  }
}

class Favorites extends React.Component {
  static navigationOptions: NavigationMaterialBottomTabOptions = {
    tabBarColor: '#00796b',
    tabBarIcon: tabBarIcon('favorite'),
  };

  render() {
    return <PhotoGrid id="favorites" />;
  }
}

class Purchased extends React.Component {
  static navigationOptions: NavigationMaterialBottomTabOptions = {
    tabBarColor: '#c51162',
    tabBarIcon: tabBarIcon('shop'),
    tabBarBadge: 'test',
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
    shifting: true,
  }
);
