/* @flow */

import React, { PureComponent } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import BasicListView from './BasicListView';

import type { NavigationState } from 'react-native-tab-view/types';

type Route = {
  key: string,
  title: string,
};

type State = NavigationState<Route>;

export default class TopBarTextExample extends PureComponent<void, *, State> {
  static title = 'Scroll views';
  static backgroundColor = '#fff';
  static tintColor = '#222';
  static appbarElevation = 0;

  static propTypes = {
    style: View.propTypes.style,
  };

  state: State = {
    index: 0,
    routes: [
      { key: '1', title: 'First' },
      { key: '2', title: 'Second' },
      { key: '3', title: 'Third' },
    ],
  };

  _first: Object;
  _second: Object;
  _third: Object;

  _handleChangeTab = index => {
    this.setState({
      index,
    });
  };

  _handleTabItemPress = route => {
    if (route !== this.state.routes[this.state.index]) {
      return;
    }
    switch (route.key) {
      case '1':
        this._first.scrollTo({ y: 0 });
        break;
      case '2':
        this._second.scrollTo({ y: 0 });
        break;
      case '3':
        this._third.scrollTo({ y: 0 });
        break;
    }
  };

  _renderLabel = props => ({ route, index }) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    const outputRange = inputRange.map(
      inputIndex => (inputIndex === index ? '#D6356C' : '#222'),
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

  _renderHeader = props => {
    return (
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
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return (
          <BasicListView
            ref={el => (this._first = el)}
            style={[styles.page, { backgroundColor: '#E3F4DD' }]}
          />
        );
      case '2':
        return (
          <BasicListView
            ref={el => (this._second = el)}
            style={[styles.page, { backgroundColor: '#E6BDC5' }]}
          />
        );
      case '3':
        return (
          <BasicListView
            ref={el => (this._third = el)}
            style={[styles.page, { backgroundColor: '#EDD8B5' }]}
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
        onRequestChangeTab={this._handleChangeTab}
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
