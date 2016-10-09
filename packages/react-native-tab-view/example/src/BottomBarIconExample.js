import React, { Component } from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';
import { TabViewAnimated, TabViewPage, TabBar } from 'react-native-tab-view';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#222',
  },
  tab: {
    opacity: 1,
  },
  indicator: {
    flex: 1,
    backgroundColor: '#0084ff',
    margin: 4,
    borderRadius: 2,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class TopBarIconExample extends Component {

  static appbarElevation = 4;

  static propTypes = {
    style: View.propTypes.style,
  };

  state = {
    index: 0,
    routes: [
      { key: '1' },
      { key: '2' },
      { key: '3' },
    ],
  };

  _handleChangeTab = (index) => {
    this.setState({
      index,
    });
  };

  _renderIndicator = (props) => {
    const { width, position } = props;

    const translateX = Animated.multiply(position, new Animated.Value(width));

    return (
      <Animated.View
        style={[ styles.indicator, { width: width - 8, transform: [ { translateX } ] } ]}
      />
    );
  };

  _renderIcon = ({ route }) => {
    switch (route.key) {
    case '1':
      return <Image source={require('../assets/tab-icon-1.png')} />;
    case '2':
      return <Image source={require('../assets/tab-icon-2.png')} />;
    case '3':
      return <Image source={require('../assets/tab-icon-3.png')} />;
    default:
      return null;
    }
  };

  _renderFooter = (props) => {
    return (
      <TabBar
        {...props}
        renderIcon={this._renderIcon}
        renderIndicator={this._renderIndicator}
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

  _renderPage = (props) => {
    return <TabViewPage {...props} renderScene={this._renderScene} />;
  };

  render() {
    return (
      <TabViewAnimated
        style={[ styles.container, this.props.style ]}
        navigationState={this.state}
        renderScene={this._renderPage}
        renderFooter={this._renderFooter}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}
