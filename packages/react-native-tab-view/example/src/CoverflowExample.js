/* @flow */
/* eslint-disable import/no-commonjs */

import * as React from 'react';
import {
  Animated,
  View,
  Image,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { TabViewAnimated, TabViewPagerPan } from 'react-native-tab-view';

import type { Route, NavigationState } from 'react-native-tab-view/types';

type State = NavigationState<
  Route<{
    key: string,
  }>
>;

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

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class CoverflowExample extends React.Component<*, State> {
  static title = 'Coverflow';
  static appbarElevation = 0;

  state = {
    index: 2,
    routes: Object.keys(ALBUMS).map(key => ({ key })),
  };

  _buildCoverFlowStyle = ({ layout, position, route, navigationState }) => {
    const { width } = layout;
    const { routes } = navigationState;
    const currentIndex = routes.indexOf(route);
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x, i) => i)];
    const translateOutputRange = inputRange.map(i => {
      return width / 2 * (currentIndex - i) * -1;
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
      transform: [{ translateX }, { scale }],
      opacity,
    };
  };

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderScene = props => (
    <Animated.View style={[styles.page, this._buildCoverFlowStyle(props)]}>
      <View style={styles.album}>
        <Image source={ALBUMS[props.route.key]} style={styles.cover} />
      </View>
      <Text style={styles.label}>{props.route.key}</Text>
    </Animated.View>
  );

  _renderPager = props => <TabViewPagerPan {...props} />;

  render() {
    return (
      <TabViewAnimated
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderPager={this._renderPager}
        renderScene={this._renderScene}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
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
