/* eslint-disable import-x/no-commonjs */
import { Text, useFrameSize } from '@react-navigation/elements';
import { useLocale } from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  Image,
  type ImageRequireSource,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  type SceneRendererProps,
  ScrollViewAdapter,
  TabView,
} from 'react-native-tab-view';

type Route = {
  key: string;
};

type Props = SceneRendererProps & {
  index: number;
  length: number;
  route: Route;
};

const ALBUMS: { [key: string]: ImageRequireSource } = {
  'Abbey Road': require('../../../assets/album-art/01.jpg'),
  'Bat Out of Hell': require('../../../assets/album-art/02.jpg'),
  Homogenic: require('../../../assets/album-art/03.jpg'),
  'Number of the Beast': require('../../../assets/album-art/04.jpg'),
  "It's Blitz": require('../../../assets/album-art/05.jpg'),
  'The Man-Machine': require('../../../assets/album-art/06.jpg'),
  'The Score': require('../../../assets/album-art/07.jpg'),
  'Lost Horizons': require('../../../assets/album-art/08.jpg'),
};

const Scene = ({ route, position, index, length }: Props) => {
  const width = useFrameSize((frame) => frame.width);

  const coverflowStyle: any = React.useMemo(() => {
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
  }, [index, length, position, width]);

  return (
    <Animated.View style={[styles.page, coverflowStyle]}>
      <View style={styles.album}>
        <Image source={ALBUMS[route.key]} style={styles.cover} />
      </View>
      <Text style={styles.label}>{route.key}</Text>
    </Animated.View>
  );
};

export function Coverflow() {
  const { direction } = useLocale();

  const [index, onIndexChange] = React.useState(2);
  const [routes] = React.useState(Object.keys(ALBUMS).map((key) => ({ key })));

  return (
    <TabView
      commonOptions={{
        sceneStyle: styles.scene,
      }}
      style={styles.container}
      navigationState={{
        index,
        routes,
      }}
      direction={direction}
      onIndexChange={onIndexChange}
      renderTabBar={() => null}
      renderScene={(props: SceneRendererProps & { route: Route }) => (
        <Scene
          {...props}
          index={routes.indexOf(props.route)}
          length={routes.length}
        />
      )}
      renderAdapter={(props) => <ScrollViewAdapter {...props} />}
    />
  );
}

Coverflow.options = {
  title: 'Coverflow',
  headerShadowVisible: false,
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: '#000',
  },
};

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
    ...Platform.select({
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 8,
        shadowOffset: {
          height: 8,
          width: 0,
        },
      },
      web: {
        boxShadow: '0 8px 8px rgba(0, 0, 0, 0.5)',
      },
    }),
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
