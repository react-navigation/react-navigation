/* @flow */

import React, { Component } from 'react';
import { Animated, View, Dimensions, StyleSheet } from 'react-native';
import { TabViewAnimated, TabViewPagerPan, TabBar } from 'react-native-tab-view';
import { Ionicons } from '@exponent/vector-icons';

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#fff',
  },
  tab: {
    opacity: 1,
    padding: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .2)',
  },
  iconContainer: {
    height: 24,
    width: 24,
  },
  icon: {
    position: 'absolute',
    textAlign: 'center',
    top: 0,
    left: 0,
    right: 0,
    color: 'white',
  },
  outline: {
    color: '#0084ff',
  },
  label: {
    fontSize: 12,
    margin: 2,
    backgroundColor: 'transparent',
  },
  indicator: {
    flex: 1,
    backgroundColor: '#0084ff',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class TopBarIconExample extends Component {

  static title = 'No animation';
  static backgroundColor = '#fff';
  static tintColor = '#222';
  static appbarElevation = 4;

  static propTypes = {
    style: View.propTypes.style,
  };

  state = {
    index: 0,
    routes: [
      { key: '1', title: 'First', icon: 'ios-book' },
      { key: '2', title: 'Second', icon: 'ios-chatboxes' },
      { key: '3', title: 'Third', icon: 'ios-paper' },
    ],
  };

  _handleChangeTab = (index) => {
    this.setState({
      index,
    });
  };

  _renderIndicator = ({ width, position }) => {
    const translateX = Animated.multiply(position, new Animated.Value(width));
    return (
      <Animated.View
        style={[ styles.indicator, { width, transform: [ { translateX } ] } ]}
      />
    );
  };

  _renderLabel = ({ position, navigationState }) => ({ route, index }) => {
    const inputRange = navigationState.routes.map((x, i) => i);
    const outputRange = inputRange.map(inputIndex => inputIndex === index ? '#fff' : '#2196f3');
    const color = position.interpolate({
      inputRange,
      outputRange,
    });
    return (
      <Animated.Text style={[ styles.label, { color } ]}>
        {route.title}
      </Animated.Text>
    );
  };

  _renderIcon = ({ navigationState, position }) => ({ route, index }: any) => {
    const inputRange = navigationState.routes.map((x, i) => i);
    const filledOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(i => i === index ? 1 : 0),
    });
    const outlineOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(i => i === index ? 0 : 1),
    });
    return (
      <View style={styles.iconContainer}>
        <AnimatedIcon
          name={route.icon}
          size={24}
          style={[ styles.icon, { opacity: filledOpacity } ]}
        />
        <AnimatedIcon
          name={route.icon + '-outline'}
          size={24}
          style={[ styles.icon, styles.outline, { opacity: outlineOpacity } ]}
        />
      </View>
    );
  };

  _renderFooter = (props) => {
    return (
      <TabBar
        {...props}
        renderIcon={this._renderIcon(props)}
        renderLabel={this._renderLabel(props)}
        renderIndicator={this._renderIndicator}
        activeOpacity={1}
        style={styles.tabbar}
        tabStyle={styles.tab}
      />
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
    case '1':
      return <View style={[ styles.page, { backgroundColor: '#ff4081' } ]} />;
    case '2':
      return <View style={[ styles.page, { backgroundColor: '#673ab7' } ]} />;
    case '3':
      return <View style={[ styles.page, { backgroundColor: '#4caf50' } ]} />;
    default:
      return null;
    }
  };

  _renderPager = (props) => {
    return <TabViewPagerPan {...props} swipeEnabled={false} />;
  };

  _configureTransition = () => null;

  render() {
    return (
      <TabViewAnimated
        style={[ styles.container, this.props.style ]}
        navigationState={this.state}
        configureTransition={this._configureTransition}
        renderPager={this._renderPager}
        renderScene={this._renderScene}
        renderFooter={this._renderFooter}
        onRequestChangeTab={this._handleChangeTab}
        initialLayout={initialLayout}
      />
    );
  }
}
