import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TabViewAnimated, TabViewPage, TabBar } from 'react-native-tab-view';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#212121',
  },
  label: {
    fontSize: 13,
    margin: 8,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    margin: 6,
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: '#2196f3',
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

  _renderIndicator = (props) => {
    const { width, navigationState } = props;

    const translateX = (navigationState.index * width) + (width / 2) - 9;

    return (
      <View
        style={[ styles.indicator, { transform: [ { translateX } ] } ]}
      />
    );
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
        renderIndicator={this._renderIndicator}
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

  _renderPage = (props) => {
    return (
      <TabViewPage
        {...props}
        swipeEnabled={false}
        renderScene={this._renderScene}
      />
    );
  };

  _configureTransition = () => null;

  render() {
    return (
      <TabViewAnimated
        style={[ styles.container, this.props.style ]}
        navigationState={this.state}
        configureTransition={this._configureTransition}
        renderScene={this._renderPage}
        renderHeader={this._renderHeader}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}
