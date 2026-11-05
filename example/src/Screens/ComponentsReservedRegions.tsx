import {
  RobotoSlab_400Regular,
  useFonts,
} from '@expo-google-fonts/roboto-slab';
import { Text } from '@react-navigation/elements';
import {
  type ReservedRegionsChangeEvent,
  type StaticScreenProps,
  UNSTABLE_ReservedRegions,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const TEXT = `Then I heard the slow, deliberate sound creeping towards me again. Slowly, slowly it drew near, scratching against the walls and tapping the furniture.

While I was still doubtful, it rapped smartly against the cellar door and closed it. I heard it go into the pantry, and the biscuit-tins rattled and a bottle smashed, and then came a heavy bump against the cellar door. Then silence that passed into an infinity of suspense.

Had it gone?

At last I decided that it had.

It came into the scullery no more; but I lay all the tenth day in the close darkness, buried among coals and firewood, not daring even to crawl out for the drink for which I craved. It was the eleventh day before I ventured so far from my security.
`;

export function ComponentsReservedRegions(_: StaticScreenProps<{}>) {
  const { colors } = useTheme();

  const [{ regions, size }, setLayout] =
    React.useState<ReservedRegionsChangeEvent>({
      regions: [],
      size: { width: 0, height: 0 },
    });

  const isLandscape = size.width > size.height;

  const statusArea = regions.find(
    (region) =>
      region.kind === 'occlusion' &&
      region.active &&
      region.frame.y === 0 &&
      region.frame.x >= size.width / 2
  );

  const foldArea = regions.find((region) => region.kind === 'division');

  const [foldAnim] = React.useState(() => new Animated.Value(0));

  React.useEffect(() => {
    const animation = Animated.timing(foldAnim, {
      toValue: foldArea?.active ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    });

    animation.start();

    return () => animation.stop();
  }, [foldArea?.active, foldAnim]);

  const [fontsLoaded] = useFonts({
    RobotoSlab_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  if (Platform.OS !== 'ios') {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>
          ReservedRegions is only available on iOS
        </Text>
      </View>
    );
  }

  const bookmarkWidth = statusArea ? statusArea.frame.width - 12 : 0;

  return (
    <UNSTABLE_ReservedRegions
      style={styles.container}
      onRegionsChange={(e) => setLayout(e.nativeEvent)}
    >
      <ScrollView
        automaticallyAdjustContentInsets
        automaticallyAdjustsScrollIndicatorInsets
        contentContainerStyle={styles.content}
      >
        <View
          style={[
            {
              justifyContent: 'center',
              padding: isLandscape ? 64 : 0,
            },
            isLandscape &&
              foldArea && {
                ...StyleSheet.absoluteFill,
                right: foldArea.frame.x + foldArea.frame.width,
              },
          ]}
        >
          <Image
            source={require('../../assets/misc/war-of-the-worlds.jpg')}
            resizeMode="contain"
            style={[
              styles.cover,
              isLandscape && foldArea && styles.coverPreview,
            ]}
          />
        </View>
        <View
          style={[
            {
              justifyContent: 'center',
              padding: 32,
            },
            isLandscape &&
              foldArea && {
                ...StyleSheet.absoluteFill,
                left: foldArea.frame.x + foldArea.frame.width,
                right: statusArea ? statusArea.frame.width : 0,
              },
          ]}
        >
          <Text style={styles.text}>{TEXT}</Text>
        </View>
      </ScrollView>
      {foldArea && (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.foldGradient,
              {
                left: foldArea.frame.x,
                top: foldArea.frame.y,
                width: foldArea.frame.width,
                height: foldArea.frame.height,
                opacity: foldAnim,
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.foldLine,
              {
                left:
                  foldArea.frame.x +
                  (foldArea.frame.width - StyleSheet.hairlineWidth) / 2,
                top: foldArea.frame.y,
                height: foldArea.frame.height,
                backgroundColor: colors.border,
              },
            ]}
          />
        </>
      )}
      {statusArea && (
        <View
          pointerEvents="none"
          style={[
            styles.bookmark,
            {
              left: statusArea.frame.x,
              width: bookmarkWidth,
              height: statusArea.frame.y + statusArea.frame.height,
            },
          ]}
        >
          <View
            style={[styles.bookmarkBody, { backgroundColor: colors.primary }]}
          />
          <View
            style={[
              styles.bookmarkTip,
              {
                left: 0,
                borderRightWidth: bookmarkWidth / 2,
                borderTopColor: colors.primary,
              },
            ]}
          />
          <View
            style={[
              styles.bookmarkTip,
              {
                right: 0,
                borderLeftWidth: bookmarkWidth / 2,
                borderTopColor: colors.primary,
              },
            ]}
          />
        </View>
      )}
    </UNSTABLE_ReservedRegions>
  );
}

ComponentsReservedRegions.title = 'Components - Reserved Regions';
ComponentsReservedRegions.linking = {};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  cover: {
    height: 'auto',
    width: 'auto',
    maxWidth: '100%',
    aspectRatio: 960 / 1280,
  },
  coverPreview: {
    borderRadius: 2,
    boxShadow: '0px 8px 18px rgba(0, 0, 0, 0.3)',
  },
  region: {
    position: 'absolute',
    borderWidth: 1,
  },
  foldGradient: {
    position: 'absolute',
    backgroundImage:
      'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.06) 25%, rgba(0, 0, 0, 0.18) 50%, rgba(255, 255, 255, 0.08) 75%, transparent)',
  },
  foldLine: {
    position: 'absolute',
    width: StyleSheet.hairlineWidth,
  },
  bookmark: {
    position: 'absolute',
    top: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  bookmarkBody: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 12,
    left: 0,
  },
  bookmarkTip: {
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  text: {
    fontFamily: 'RobotoSlab_400Regular',
  },
});
