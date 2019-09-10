import * as React from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import PhotoGrid from './shared/PhotoGrid';
import tabBarIcon from './shared/tabBarIcon';

class Album extends React.Component {
  static navigationOptions = {
    tabBarColor: '#6200ee',
    tabBarIcon: tabBarIcon('photo-album'),
  };

  render() {
    return <PhotoGrid id="album" />;
  }
}

class Library extends React.Component {
  static navigationOptions = {
    tabBarColor: '#2962ff',
    tabBarIcon: tabBarIcon('inbox'),
  };

  render() {
    return <PhotoGrid id="library" />;
  }
}

class Favorites extends React.Component {
  static navigationOptions = {
    tabBarColor: '#00796b',
    tabBarIcon: tabBarIcon('favorite'),
  };

  render() {
    return <PhotoGrid id="favorites" />;
  }
}

class Purchased extends React.Component {
  static navigationOptions = {
    tabBarColor: '#c51162',
    tabBarIcon: tabBarIcon('shop'),
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
