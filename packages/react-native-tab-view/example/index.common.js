import React, { Component } from 'react';
import { AppRegistry, Text, View, StyleSheet } from 'react-native';
import { TabView, TabBarTop } from 'react-native-tab-view';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#2196f3',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default class TabViewExample extends Component {
  state = {
    navigation: {
      index: 0,
      scenes: [
        { key: 'first', label: 'First' },
        { key: 'second', label: 'Second' },
      ],
    },
  };

  _handleChangeTab = (index) => {
    this.setState({
      navigation: { ...this.state.navigation, index },
    });
  };

  _renderHeader = () => {
    return (
      <TabBarTop
        navigationState={this.state.navigation}
        onRequestChangeTab={this._handleChangeTab}
        indicatorColor='#ffeb3b'
        labelStyle={styles.tablabel}
        style={styles.tabbar}
      />
    );
  };

  _renderScene = ({ scene }) => {
    switch (scene.key) {
    case 'first':
      return <View style={[ styles.page, { backgroundColor: '#ff4081' } ]} />;
    case 'second':
      return <View style={[ styles.page, { backgroundColor: '#673ab7' } ]} />;
    default:
      return null;
    }
  };

  render() {
    return (
      <TabView
        style={styles.container}
        navigationState={this.state.navigation}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}

AppRegistry.registerComponent('tabviewexample', () => TabViewExample);
