import * as React from 'react';
import {
  I18nManager,
  Platform,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import * as Reanimated from 'react-native-reanimated';

import { SWIPE_MIN_DISTANCE, SWIPE_MIN_VELOCITY } from '../constants';
import type { DrawerProps } from '../types';
import { GestureHandlerRootView } from './GestureHandler';

type Props = DrawerProps & {
  /**
   * Whether to use the legacy implementation of the drawer.
   * The legacy implementation uses v1 of Reanimated.
   * The modern implementation uses v2 of Reanimated.
   *
   * By default, the appropriate implementation is used based on whether Reanimated v2 is configured.
   */
  useLegacyImplementation?: boolean;

  /**
   * Style object for the wrapper view.
   */
  style?: StyleProp<ViewStyle>;
};

const getDefaultDrawerWidth = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => {
  /*
   * Default drawer width is screen width - header height
   * with a max width of 280 on mobile and 320 on tablet
   * https://material.io/components/navigation-drawer
   */
  const smallerAxisSize = Math.min(height, width);
  const isLandscape = width > height;
  const isTablet = smallerAxisSize >= 600;
  const appBarHeight = Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
  const maxWidth = isTablet ? 320 : 280;

  return Math.min(smallerAxisSize - appBarHeight, maxWidth);
};

export function Drawer({
  // Reanimated 2 is not configured
  // @ts-expect-error: the type definitions are incomplete
  useLegacyImplementation = !Reanimated.isConfigured?.(),
  layout: customLayout,
  drawerType = Platform.select({ ios: 'slide', default: 'front' }),
  drawerPosition = I18nManager.getConstants().isRTL ? 'right' : 'left',
  drawerStyle,
  swipeEnabled = Platform.OS !== 'web' &&
    Platform.OS !== 'windows' &&
    Platform.OS !== 'macos',
  swipeEdgeWidth = 32,
  swipeMinDistance = SWIPE_MIN_DISTANCE,
  swipeMinVelocity = SWIPE_MIN_VELOCITY,
  keyboardDismissMode = 'on-drag',
  hideStatusBarOnOpen = false,
  statusBarAnimation = 'slide',
  style,
  ...rest
}: Props) {
  // Reanimated v3 dropped legacy v1 API
  const legacyImplemenationNotAvailable =
    require('react-native-reanimated').abs === undefined;

  if (useLegacyImplementation && legacyImplemenationNotAvailable) {
    throw new Error(
      'The `useLegacyImplementation` prop is not available with Reanimated 3 as it no longer includes support for Reanimated 1 legacy API. Remove the `useLegacyImplementation` prop from `Drawer.Navigator` to be able to use it.'
    );
  }

  const Drawer: typeof import('./modern/Drawer').Drawer =
    useLegacyImplementation
      ? require('./legacy/Drawer').Drawer
      : require('./modern/Drawer').Drawer;

  const windowDimensions = useWindowDimensions();
  const layout = customLayout ?? windowDimensions;

  return (
    <GestureHandlerRootView style={[styles.container, style]}>
      <Drawer
        {...rest}
        layout={layout}
        drawerType={drawerType}
        drawerPosition={drawerPosition}
        drawerStyle={[
          { width: getDefaultDrawerWidth(layout) },
          styles.drawer,
          drawerStyle,
        ]}
        swipeEnabled={swipeEnabled}
        swipeEdgeWidth={swipeEdgeWidth}
        swipeMinDistance={swipeMinDistance}
        swipeMinVelocity={swipeMinVelocity}
        keyboardDismissMode={keyboardDismissMode}
        hideStatusBarOnOpen={hideStatusBarOnOpen}
        statusBarAnimation={statusBarAnimation}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawer: {
    backgroundColor: 'white',
  },
});
