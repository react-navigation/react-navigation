/* eslint-disable import/no-commonjs */

import * as React from 'react';
import {
  Animated,
  View,
  Image,
  Text,
  StyleSheet,
  ImageRequireSource,
} from 'react-native';
import { TabView, SceneRendererProps } from 'react-native-tab-view';

type Route = {
  key: string;
};

type Props = SceneRendererProps & {
  index: number;
  length: number;
  route: Route;
};

const ALBUMS: { [key: string]: ImageRequireSource } = {
  'Abbey Road': require('../assets/album-art-1.jpg'),
  'Bat Out of Hell': require('../assets/album-art-2.jpg'),
  'Homogenic': require('../assets/album-art-3.jpg'),
  'Number of the Beast': require('../assets/album-art-4.jpg'),
  "It's Blitz": require('../assets/album-art-5.jpg'),
  'The Man-Machine': require('../assets/album-art-6.jpg'),
  'The Score': require('../assets/album-art-7.jpg'),
  'Lost Horizons': require('../assets/album-art-8.jpg'),
};

const Scene = ({ route, position, layout, index, length }: Props) => {
  const coverflowStyle: any = React.useMemo(() => {
    const { width } = layout;

    const inputRange = Array.from({ length }, (_, i) => i);
    const translateOutputRange = inputRange.map((i) => {
      return (width / 2) * (index - i) * -1;
    });
    const scaleOutputRange = inputRange.map((i) => {
      if (index === i) {
        return 1;
      } else {
        return 0.7;
      }
    });
    const opacityOutputRange = inputRange.map((i) => {
      if (index === i) {
        return 1;
      } else {
        return 0.3;
      }
    });

    const translateX = position.interpolate({
      inputRange,
      outputRange: translateOutputRange,
      extrapolate: 'clamp',
    });
    const scale = position.interpolate({
      inputRange,
      outputRange: scaleOutputRange,
      extrapolate: 'clamp',
    });
    const opacity = position.interpolate({
      inputRange,
      outputRange: opacityOutputRange,
      extrapolate: 'clamp',
    });

    return {
      transform: [{ translateX }, { scale }],
      opacity,
    };
  }, [index, layout, length, position]);

  return (
    <Animated.View style={[styles.page, coverflowStyle]}>
      <View style={styles.album}>
        <Image source={ALBUMS[route.key]} style={styles.cover} />
      </View>
      <Text style={styles.label}>{route.key}</Text>
    </Animated.View>
  );
};

export default function CoverflowExample() {
  const [index, onIndexChange] = React.useState(2);
  const [routes] = React.useState(Object.keys(ALBUMS).map((key) => ({ key })));

  return (
    <TabView
      style={styles.container}
      sceneContainerStyle={styles.scene}
      offscreenPageLimit={3}
      navigationState={{
        index,
        routes,
      }}
      onIndexChange={onIndexChange}
      renderTabBar={() => null}
      renderScene={(props: SceneRendererProps & { route: Route }) => (
        <Scene
          {...props}
          index={routes.indexOf(props.route)}
          length={routes.length}
        />
      )}
    />
  );
}

CoverflowExample.title = 'Coverflow';
CoverflowExample.backgroundColor = '#000';
CoverflowExample.appbarElevation = 0;

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
      width: 0,
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
