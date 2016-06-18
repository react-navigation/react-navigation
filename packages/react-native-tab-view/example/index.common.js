import React, { Component } from 'react';
import { AppRegistry, View, StyleSheet } from 'react-native';
import { TabViewTransitioner, TabView, TabBarTop } from 'react-native-tab-view';

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
        { key: '1', label: 'First' },
        { key: '2', label: 'Second' },
        { key: '3', label: 'Third' },
      ],
    },
  };

  _handleChangeTab = (index) => {
    this.setState({
      navigation: { ...this.state.navigation, index },
    });
  };

  _renderHeader = (props) => {
    return (
      <TabBarTop
        {...props}
        indicatorColor='#ffeb3b'
        pressColor='rgba(0, 0, 0, .5)'
        labelStyle={styles.tablabel}
        style={styles.tabbar}
      />
    );
  };

  _renderScene = ({ scene }) => {
    switch (scene.key) {
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

  _renderTabView = (props) => {
    return <TabView {...props} renderScene={this._renderScene} />;
  };

  render() {
    return (
      <TabViewTransitioner
        style={styles.container}
        navigationState={this.state.navigation}
        renderScene={this._renderTabView}
        renderHeader={this._renderHeader}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}

AppRegistry.registerComponent('tabviewexample', () => TabViewExample);
