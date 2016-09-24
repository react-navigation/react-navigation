import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabViewAnimated, TabViewPage, TabBarTop } from 'react-native-tab-view';
import ListViewExample from './ListViewExample';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#2196f3',
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
});

export default class TopBarTextExample extends Component {
  static propTypes = {
    style: View.propTypes.style,
  };

  state = {
    index: 0,
    routes: [
      { key: '1', title: 'First' },
      { key: '2', title: 'Second' },
      { key: '3', title: 'Third' },
    ],
  };

  _handleChangeTab = (index) => {
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

  _renderHeader = (props) => {
    return (
      <TabBarTop
        {...props}
        pressColor='rgba(0, 0, 0, .2)'
        onTabItemPress={this._handleTabItemPress}
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
      />
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
    case '1':
      return <ListViewExample ref={el => (this._first = el)} style={{ backgroundColor: '#ff4081' }} />;
    case '2':
      return <ListViewExample ref={el => (this._second = el)} style={{ backgroundColor: '#673ab7' }} />;
    case '3':
      return <ListViewExample ref={el => (this._third = el)} style={{ backgroundColor: '#4caf50' }} />;
    default:
      return null;
    }
  };

  _renderPage = (props) => {
    return <TabViewPage {...props} renderScene={this._renderScene} />;
  };

  render() {
    return (
      <TabViewAnimated
        style={[ styles.container, this.props.style ]}
        navigationState={this.state}
        renderScene={this._renderPage}
        renderHeader={this._renderHeader}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}
