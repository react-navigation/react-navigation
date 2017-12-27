/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import SimplePage from './SimplePage';

import type { Route, NavigationState } from 'react-native-tab-view/types';

type State = NavigationState<
  Route<{
    key: string,
    icon: string,
  }>
>;

export default class TopBarIconExample extends React.Component<*, State> {
  static title = 'Icon only top bar';
  static appbarElevation = 0;

  state = {
    index: 0,
    routes: [
      { key: '1', icon: 'md-restaurant' },
      { key: '2', icon: 'md-bicycle' },
      { key: '3', icon: 'md-color-palette' },
    ],
  };

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderIcon = ({ route }) => (
    <Ionicons name={route.icon} size={24} color="white" />
  );

  _renderHeader = props => {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        renderIcon={this._renderIcon}
        style={styles.tabbar}
      />
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#ff4081' }}
          />
        );
      case '2':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#673ab7' }}
          />
        );
      case '3':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#4caf50' }}
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <TabViewAnimated
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#222',
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
});
