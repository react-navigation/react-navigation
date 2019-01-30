/* @flow */

import * as React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { TabView, type NavigationState } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';

type State = NavigationState<{
  key: string,
}>;

const ALBUMS = {
  'Abbey Road': require('../assets/album-art-1.jpg'),
  'Bat Out of Hell': require('../assets/album-art-2.jpg'),
  Homogenic: require('../assets/album-art-3.jpg'),
  'Number of the Beast': require('../assets/album-art-4.jpg'),
  "It's Blitz": require('../assets/album-art-5.jpg'),
  'The Man-Machine': require('../assets/album-art-6.jpg'),
  'The Score': require('../assets/album-art-7.jpg'),
  'Lost Horizons': require('../assets/album-art-8.jpg'),
};

export default class CoverflowExample extends React.Component<*, State> {
  static title = 'Coverflow';
  static backgroundColor = '#000';
  static appbarElevation = 0;

  state = {
    index: 2,
    /* $FlowFixMe */
    routes: Object.keys(ALBUMS).map(key => ({ key })),
  };

  _buildCoverFlowStyle = ({ layout, position, route, navigationState }) => {
    const { width } = layout;
    const { routes } = navigationState;
    const currentIndex = routes.indexOf(route);
    const inputRange = routes.map((x, i) => i);
    const translateOutputRange = inputRange.map(i => {
      return (width / 2) * (currentIndex - i) * -1;
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

    const translateX = Animated.interpolate(position, {
      inputRange,
      outputRange: translateOutputRange,
      extrapolate: 'clamp',
    });
    const scale = Animated.interpolate(position, {
      inputRange,
      outputRange: scaleOutputRange,
      extrapolate: 'clamp',
    });
    const opacity = Animated.interpolate(position, {
      inputRange,
      outputRange: opacityOutputRange,
      extrapolate: 'clamp',
    });

    return {
      transform: [{ translateX }, { scale }],
      opacity,
    };
  };

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderTabBar = () => null;

  _renderScene = props => (
    <Animated.View style={[styles.page, this._buildCoverFlowStyle(props)]}>
      <View style={styles.album}>
        <Image source={ALBUMS[props.route.key]} style={styles.cover} />
      </View>
      <Text style={styles.label}>{props.route.key}</Text>
    </Animated.View>
  );

  render() {
    return (
      <TabView
        style={[styles.container, this.props.style]}
        sceneContainerStyle={styles.scene}
        navigationState={this.state}
        renderTabBar={this._renderTabBar}
        renderScene={this._renderScene}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  scene: {
    overflow: 'visible',
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
    },
  },
  cover: {
    width: 200,
    height: 200,
  },
  label: {
    margin: 16,
    color: '#fff',
  },
});
