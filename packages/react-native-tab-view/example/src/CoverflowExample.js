/* eslint-disable import/no-commonjs */

import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { TabViewAnimated, TabViewPage } from 'react-native-tab-view';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222'
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  album: {
    backgroundColor: '#000',
    width: 200,
    height: 200,
    elevation: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: {
      height: 8,
    }
  },
  cover: {
    width: 200,
    height: 200,
  },
  label: {
    margin: 16,
    color: '#fff',
  }
});

const ALBUMS = {
  'Abbey Road': require('../assets/album-art-1.jpg'),
  'Bat Out of Hell': require('../assets/album-art-2.jpg'),
  Homogenic: require('../assets/album-art-3.jpg'),
  'Number of the Beast': require('../assets/album-art-4.jpg'),
  'It\'s Blitz': require('../assets/album-art-5.jpg'),
  'The Man-Machine': require('../assets/album-art-6.jpg'),
  'The Score': require('../assets/album-art-7.jpg'),
  'Lost Horizons': require('../assets/album-art-8.jpg'),
};

export default class CoverflowExample extends Component {
  static propTypes = {
    style: View.propTypes.style,
  };

  state = {
    navigation: {
      index: 2,
      routes: Object.keys(ALBUMS).map(key => ({ key })),
    },
  };

  _buildCoverFlowStyle = ({ layout, position, route, navigationState }) => {
    const { width } = layout;
    const { routes } = navigationState;
    const currentIndex = routes.indexOf(route);
    const inputRange = routes.map((x, i) => i);
    const translateOutputRange = inputRange.map(i => {
      return width * (currentIndex - i) - ((width / 2) * (currentIndex - i));
    });
    const scaleOutputRange = inputRange.map(i => {
      if (currentIndex === i) {
        return 1;
      } else {
        return 0.7;
      }
    });
    const opacityOutputRange = inputRange.map(i => {
      if (currentIndex === i) {
        return 1;
      } else {
        return 0.3;
      }
    });

    const translateX = position.interpolate({
      inputRange,
      outputRange: translateOutputRange,
    });
    const scale = position.interpolate({
      inputRange,
      outputRange: scaleOutputRange,
    });
    const opacity = position.interpolate({
      inputRange,
      outputRange: opacityOutputRange,
    });

    return {
      width,
      transform: [
        { translateX },
        { scale },
      ],
      opacity,
    };
  };

  _handleChangeTab = (index) => {
    this.setState({
      navigation: { ...this.state.navigation, index },
    });
  };

  _renderScene = ({ route }) => {
    return (
      <View style={styles.page}>
        <View style={styles.album}>
          <Image source={ALBUMS[route.key]} style={styles.cover} />
        </View>
        <Text style={styles.label}>{route.key}</Text>
      </View>
    );
  };

  _renderPage = (props) => {
    return (
      <TabViewPage
        {...props}
        style={this._buildCoverFlowStyle(props)}
        renderScene={this._renderScene}
      />
    );
  };

  render() {
    return (
      <TabViewAnimated
        style={[ styles.container, this.props.style ]}
        navigationState={this.state.navigation}
        renderScene={this._renderPage}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}
