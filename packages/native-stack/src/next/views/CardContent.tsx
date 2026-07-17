import {
  getDefaultHeaderHeight,
  HeaderBackContext,
  HeaderHeightContext,
  HeaderShownContext,
  useFrameSize,
} from '@react-navigation/elements';
import { ActivityView } from '@react-navigation/elements/internal';
import * as React from 'react';
import {
  Animated,
  type ColorValue,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { NativeStackDescriptor } from '../../types';
import { AnimatedHeaderHeightContext } from '../../utils/useAnimatedHeaderHeight';

type Props = {
  descriptor: NativeStackDescriptor;
  headerBack: React.ContextType<typeof HeaderBackContext>;
  activityMode: React.ComponentProps<typeof ActivityView>['mode'] | 'unmounted';
  backgroundColor: ColorValue;
};

export function CardContent({
  descriptor,
  headerBack,
  activityMode,
  backgroundColor,
}: Props) {
  const { route, navigation, options, render } = descriptor;

  const {
    header,
    headerBackground,
    headerShown,
    headerTransparent,
    contentStyle,
  } = options;
  const usesNativeHeaderBackground =
    Platform.OS === 'android' && header == null && headerShown !== false;

  const insets = useSafeAreaInsets();

  const parentHeaderHeight = React.use(HeaderHeightContext);
  const isParentHeaderShown = React.use(HeaderShownContext);

  const isLandscape = useFrameSize((frame) => frame.width > frame.height);

  const topInset =
    isParentHeaderShown ||
    (Platform.OS === 'ios' && !(Platform.isPad || Platform.isTV) && isLandscape)
      ? 0
      : insets.top;

  const defaultHeaderHeight = useFrameSize((frame) =>
    getDefaultHeaderHeight({
      landscape: frame.width > frame.height,
      modalPresentation: false,
      topInset,
    })
  );

  const [animatedHeaderHeight] = React.useState(
    () => new Animated.Value(defaultHeaderHeight)
  );

  const [headerHeight, setHeaderHeight] = React.useState(defaultHeaderHeight);

  const headerContainerRef = React.useRef<View>(null);

  // Stable so the layout effect below only runs on mount.
  const updateHeaderHeight = React.useCallback(
    (height: number) => {
      animatedHeaderHeight.setValue(height);
      setHeaderHeight(height);
    },
    [animatedHeaderHeight]
  );

  React.useLayoutEffect(() => {
    headerContainerRef.current?.measure((_x, _y, _width, height) => {
      updateHeaderHeight(height);
    });
  }, [updateHeaderHeight]);

  return (
    <View style={[styles.container, { backgroundColor }, contentStyle]}>
      {activityMode === 'unmounted' ? null : (
        <ActivityView mode={activityMode} visible style={styles.content}>
          <AnimatedHeaderHeightContext.Provider value={animatedHeaderHeight}>
            <HeaderHeightContext.Provider
              value={
                headerShown !== false ? headerHeight : (parentHeaderHeight ?? 0)
              }
            >
              {headerBackground != null && !usesNativeHeaderBackground ? (
                <View
                  style={[
                    styles.background,
                    headerTransparent
                      ? [styles.absolute, styles.elevated]
                      : null,
                    { height: headerHeight },
                  ]}
                >
                  {headerBackground()}
                </View>
              ) : null}
              {header != null && headerShown !== false ? (
                <View
                  style={[
                    styles.header,
                    headerTransparent
                      ? [styles.absolute, { minHeight: headerHeight }]
                      : null,
                  ]}
                >
                  <View
                    ref={headerContainerRef}
                    onLayout={(e) =>
                      updateHeaderHeight(e.nativeEvent.layout.height)
                    }
                    style={styles.headerContent}
                  >
                    {header({
                      back: headerBack,
                      options,
                      route,
                      navigation,
                    })}
                  </View>
                </View>
              ) : null}
              <HeaderShownContext.Provider
                value={isParentHeaderShown || headerShown !== false}
              >
                <HeaderBackContext.Provider value={headerBack}>
                  {render()}
                </HeaderBackContext.Provider>
              </HeaderShownContext.Provider>
            </HeaderHeightContext.Provider>
          </AnimatedHeaderHeightContext.Provider>
        </ActivityView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    zIndex: 1,
  },
  headerContent: {
    pointerEvents: 'box-none',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
  elevated: {
    zIndex: 1,
    elevation: 1,
  },
  background: {
    overflow: 'hidden',
  },
});
