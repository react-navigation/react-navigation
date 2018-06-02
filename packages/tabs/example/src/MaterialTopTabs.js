import * as React from 'react';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import PhotoGrid from './shared/PhotoGrid';

class Album extends React.Component {
  render() {
    return <PhotoGrid id="album" />;
  }
}

class Library extends React.Component {
  render() {
    return <PhotoGrid id="library" />;
  }
}

class History extends React.Component {
  render() {
    return <PhotoGrid id="history" />;
  }
}

export default createMaterialTopTabNavigator({
  Album,
  Library,
  History,
});
