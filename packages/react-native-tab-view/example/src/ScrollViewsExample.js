/* @flow */

import React, { PureComponent } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import BasicListView from './BasicListView';

import type { Route, NavigationState } from 'react-native-tab-view/types';

type State = NavigationState<
  Route<{
    key: string,
    title: string,
  }>
>;

export default class TopBarTextExample extends PureComponent<*, State> {
  static title = 'Scroll views';
  static backgroundColor = '#fff';
  static tintColor = '#222';
  static appbarElevation = 0;

  state = {
    index: 0,
    routes: [
      { key: '1', title: 'First' },
      { key: '2', title: 'Second' },
      { key: '3', title: 'Third' },
    ],
  };

  _first: ?BasicListView;
  _second: ?BasicListView;
  _third: ?BasicListView;

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _handleTabItemPress = ({ route }) => {
    if (route !== this.state.routes[this.state.index]) {
      return;
    }
    switch (route.key) {
      case '1':
        if (this._first) {
          this._first.scrollTo({ y: 0 });
        }
        break;
      case '2':
        if (this._second) {
          this._second.scrollTo({ y: 0 });
        }
        break;
      case '3':
        if (this._third) {
          this._third.scrollTo({ y: 0 });
        }
        break;
    }
  };

  _renderLabel = props => ({ route, index }) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    const outputRange = inputRange.map(
      inputIndex => (inputIndex === index ? '#D6356C' : '#222')
    );
    const color = props.position.interpolate({
      inputRange,
      outputRange,
    });

    return (
      <Animated.Text style={[styles.label, { color }]}>
        {route.title}
      </Animated.Text>
    );
  };

  _renderHeader = props => (
    <TabBar
      {...props}
      pressColor="rgba(255, 64, 129, .5)"
      onTabPress={this._handleTabItemPress}
      renderLabel={this._renderLabel(props)}
      indicatorStyle={styles.indicator}
      tabStyle={styles.tab}
      style={styles.tabbar}
    />
  );

  _renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return (
          <BasicListView
            ref={(el: ?BasicListView) => (this._first = el)}
            style={[styles.page, { backgroundColor: '#E3F4DD' }]}
          />
        );
      case '2':
        return (
          <BasicListView
            ref={(el: ?BasicListView) => (this._second = el)}
            style={[styles.page, { backgroundColor: '#E6BDC5' }]}
            initialListSize={1}
          />
        );
      case '3':
        return (
          <BasicListView
            ref={(el: ?BasicListView) => (this._third = el)}
            style={[styles.page, { backgroundColor: '#EDD8B5' }]}
            initialListSize={1}
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
  indicator: {
    backgroundColor: '#ff4081',
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    margin: 8,
  },
  tabbar: {
    backgroundColor: '#fff',
  },
  tab: {
    opacity: 1,
    width: 90,
  },
  page: {
    backgroundColor: '#f9f9f9',
  },
});
