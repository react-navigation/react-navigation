/* @flow */

import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { TabViewAnimated, TabViewPagerPan, TabBar } from 'react-native-tab-view';
import { Ionicons } from '@exponent/vector-icons';

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
  label: {
    fontSize: 12,
    margin: 2,
  },
  idle: {
    backgroundColor: 'transparent',
    color: '#2196f3',
  },
  selected: {
    backgroundColor: 'transparent',
    color: 'white',
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

  _renderIndicator = ({ navigationState, width }) => {
    const translateX = navigationState.index * width;
    return (
      <View
        style={[ styles.indicator, { width, transform: [ { translateX } ] } ]}
      />
    );
  };

  _renderLabel = ({ navigationState }) => ({ route, index }) => {
    const selected = navigationState.index === index;
    return (
      <Text style={[ styles.label, selected ? styles.selected : styles.idle ]}>
        {route.title}
      </Text>
    );
  };

  _renderIcon = ({ navigationState }) => ({ route, index }: any) => {
    const selected = navigationState.index === index;
    return (
      <Ionicons
        name={selected ? route.icon : route.icon + '-outline'}
        size={24}
        style={[ selected ? styles.selected : styles.idle ]}
      />
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
