import {
  getDefaultHeaderHeight,
  HeaderHeightContext,
  HeaderShownContext,
  useFrameSize,
} from '@react-navigation/elements';
import * as React from 'react';
import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  useAnimatedValue,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenStack, ScreenStackItem } from 'react-native-screens';

import type { NativeBottomTabHeaderProps } from '../types';
import { debounce } from './debounce';
import { AnimatedHeaderHeightContext } from './useAnimatedHeaderHeight';
import { useHeaderConfig } from './useHeaderConfig';

type Props = NativeBottomTabHeaderProps & {
  children: React.ReactNode;
};

const ANDROID_DEFAULT_HEADER_HEIGHT = 56;

export function NativeScreen({ route, navigation, options, children }: Props) {
  const {
    header: renderCustomHeader,
    headerShown = renderCustomHeader != null,
    headerTransparent,
    headerBackground,
  } = options;

  const isModal = false;
  const insets = useSafeAreaInsets();

  // Modals are fullscreen in landscape only on iPhone
  const isIPhone = Platform.OS === 'ios' && !(Platform.isPad || Platform.isTV);

  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const parentHeaderHeight = React.useContext(HeaderHeightContext);

  const isLandscape = useFrameSize((frame) => frame.width > frame.height);

  const topInset =
    isParentHeaderShown ||
    (Platform.OS === 'ios' && isModal) ||
    (isIPhone && isLandscape)
      ? 0
      : insets.top;

  const defaultHeaderHeight = useFrameSize((frame) =>
    Platform.select({
      // FIXME: Currently screens isn't using Material 3
      // So our `getDefaultHeaderHeight` doesn't return the correct value
      // So we hardcode the value here for now until screens is updated
      android: ANDROID_DEFAULT_HEADER_HEIGHT + topInset,
      default: getDefaultHeaderHeight(frame, isModal, topInset),
    })
  );

  const [headerHeight, setHeaderHeight] = React.useState(defaultHeaderHeight);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setHeaderHeightDebounced = React.useCallback(
    // Debounce the header height updates to avoid excessive re-renders
    debounce(setHeaderHeight, 100),
    []
  );

  const hasCustomHeader = renderCustomHeader != null;

  let headerHeightCorrectionOffset = 0;

  if (Platform.OS === 'android' && !hasCustomHeader) {
    const statusBarHeight = StatusBar.currentHeight ?? 0;

    // FIXME: On Android, the native header height is not correctly calculated
    // It includes status bar height even if statusbar is not translucent
    // And the statusbar value itself doesn't match the actual status bar height
    // So we subtract the bogus status bar height and add the actual top inset
    headerHeightCorrectionOffset = -statusBarHeight + topInset;
  }

  const rawAnimatedHeaderHeight = useAnimatedValue(defaultHeaderHeight);
  const animatedHeaderHeight = React.useMemo(
    () =>
      Animated.add<number>(
        rawAnimatedHeaderHeight,
        headerHeightCorrectionOffset
      ),
    [headerHeightCorrectionOffset, rawAnimatedHeaderHeight]
  );

  const headerTopInsetEnabled = topInset !== 0;

  const onHeaderHeightChange = Animated.event(
    [
      {
        nativeEvent: {
          headerHeight: rawAnimatedHeaderHeight,
        },
      },
    ],
    {
      useNativeDriver: true,
      listener: (e) => {
        if (hasCustomHeader) {
          // If we have a custom header, don't use native header height
          return;
        }

        if (
          Platform.OS === 'android' &&
          (options.headerBackground != null || options.headerTransparent)
        ) {
          // FIXME: On Android, we get 0 if the header is translucent
          // So we set a default height in that case
          setHeaderHeight(ANDROID_DEFAULT_HEADER_HEIGHT + topInset);
          return;
        }

        if (
          e.nativeEvent &&
          typeof e.nativeEvent === 'object' &&
          'headerHeight' in e.nativeEvent &&
          typeof e.nativeEvent.headerHeight === 'number'
        ) {
          const headerHeight =
            e.nativeEvent.headerHeight + headerHeightCorrectionOffset;

          // Only debounce if header has large title or search bar
          // As it's the only case where the header height can change frequently
          const doesHeaderAnimate =
            Platform.OS === 'ios' &&
            (options.headerLargeTitle || options.headerSearchBarOptions);

          if (doesHeaderAnimate) {
            setHeaderHeightDebounced(headerHeight);
          } else {
            setHeaderHeight(headerHeight);
          }
        }
      },
    }
  );

  const headerConfig = useHeaderConfig({
    ...options,
    route,
    headerHeight,
    headerShown: hasCustomHeader ? false : headerShown === true,
    headerTopInsetEnabled,
  });

  return (
    <ScreenStack style={styles.container}>
      <ScreenStackItem
        screenId={route.key}
        // Needed to show search bar in tab bar with systemItem=search
        stackPresentation="push"
        headerConfig={headerConfig}
        onHeaderHeightChange={onHeaderHeightChange}
      >
        <AnimatedHeaderHeightContext.Provider value={animatedHeaderHeight}>
          <HeaderHeightContext.Provider
            value={headerShown ? headerHeight : (parentHeaderHeight ?? 0)}
          >
            {headerBackground != null ? (
              /**
               * To show a custom header background, we render it at the top of the screen below the header
               * The header also needs to be positioned absolutely (with `translucent` style)
               */
              <View
                style={[
                  styles.background,
                  headerTransparent ? styles.translucent : null,
                  { height: headerHeight },
                ]}
              >
                {headerBackground()}
              </View>
            ) : null}
            {hasCustomHeader && headerShown ? (
              <View
                onLayout={(e) => {
                  const headerHeight = e.nativeEvent.layout.height;

                  setHeaderHeight(headerHeight);
                  rawAnimatedHeaderHeight.setValue(headerHeight);
                }}
                style={[
                  styles.header,
                  headerTransparent ? styles.absolute : null,
                ]}
              >
                {renderCustomHeader?.({
                  route,
                  navigation,
                  options,
                })}
              </View>
            ) : null}
            <HeaderShownContext.Provider
              value={isParentHeaderShown || headerShown}
            >
              {children}
            </HeaderShownContext.Provider>
          </HeaderHeightContext.Provider>
        </AnimatedHeaderHeightContext.Provider>
      </ScreenStackItem>
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    zIndex: 1,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
  translucent: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    zIndex: 1,
    elevation: 1,
  },
  background: {
    overflow: 'hidden',
  },
});
