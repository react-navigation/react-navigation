/* @flow */

import * as React from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import SimplePage from './SimplePage';

import type { Route, NavigationState } from 'react-native-tab-view/types';

type State = NavigationState<
  Route<{
    key: string,
    title: string,
    icon: string,
    color: string,
  }>
>;

export default class BottomBarIconExample extends React.Component<*, State> {
  static title = 'Bottom bar with indicator';
  static appbarElevation = 4;

  state = {
    index: 0,
    routes: [
      { key: '1', title: 'First', icon: 'ios-speedometer', color: '#F44336' },
      {
        key: '2',
        title: 'Second',
        icon: 'ios-game-controller-b',
        color: '#4CAF50',
      },
      { key: '3', title: 'Third', icon: 'ios-basketball', color: '#3F51B5' },
    ],
  };

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderIndicator = props => {
    const { width, position } = props;
    const inputRange = [
      0,
      0.48,
      0.49,
      0.51,
      0.52,
      1,
      1.48,
      1.49,
      1.51,
      1.52,
      2,
    ];

    const scale = position.interpolate({
      inputRange,
      outputRange: inputRange.map(x => (Math.trunc(x) === x ? 2 : 0.1)),
    });
    const opacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(x => {
        const d = x - Math.trunc(x);
        return d === 0.49 || d === 0.51 ? 0 : 1;
      }),
    });
    const translateX = position.interpolate({
      inputRange: inputRange,
      outputRange: inputRange.map(x => Math.round(x) * width),
    });
    const backgroundColor = position.interpolate({
      inputRange,
      outputRange: inputRange.map(
        x => props.navigationState.routes[Math.round(x)].color
      ),
    });

    return (
      <Animated.View
        style={[styles.container, { width, transform: [{ translateX }] }]}
      >
        <Animated.View
          style={[
            styles.indicator,
            { backgroundColor, opacity, transform: [{ scale }] },
          ]}
        />
      </Animated.View>
    );
  };

  _renderIcon = ({ route }) => (
    <Ionicons name={route.icon} size={24} style={styles.icon} />
  );

  _renderBadge = ({ route }) => {
    if (route.key === '2') {
      return (
        <View style={styles.badge}>
          <Text style={styles.count}>42</Text>
        </View>
      );
    }
    return null;
  };

  _getLabelText = ({ route }) => route.title;

  _renderFooter = props => (
    <TabBar
      {...props}
      getLabelText={this._getLabelText}
      renderIcon={this._renderIcon}
      renderBadge={this._renderBadge}
      renderIndicator={this._renderIndicator}
      labelStyle={styles.label}
      tabStyle={styles.tab}
      style={styles.tabbar}
    />
  );

  _renderScene = ({ route }) => (
    <SimplePage state={this.state} style={{ backgroundColor: route.color }} />
  );

  render() {
    return (
      <TabViewAnimated
        style={this.props.style}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderFooter={this._renderFooter}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#222',
  },
  tab: {
    padding: 0,
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  indicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0084ff',
    margin: 6,
  },
  badge: {
    marginTop: 4,
    marginRight: 32,
    backgroundColor: '#f44336',
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
