import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TabViewAnimated, TabViewPagerPan, TabBar } from 'react-native-tab-view';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#212121',
  },
  label: {
    fontSize: 14,
    margin: 8,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class TopBarIconExample extends Component {
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

  _renderLabel = ({ navigationState }) => ({ route, index }) => {
    return (
      <Text style={[ styles.label, { color: navigationState.index === index ? '#2196f3' : '#fff' } ]}>
        {route.title}
      </Text>
    );
  };

  _renderHeader = (props) => {
    return (
      <TabBar
        {...props}
        renderLabel={this._renderLabel(props)}
        style={styles.tabbar}
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
        renderHeader={this._renderHeader}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}
