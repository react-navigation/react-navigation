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
  headerBackgroundMode: 'native' | 'screen' | 'none';
};

export function CardContent({
  descriptor,
  headerBack,
  activityMode,
  backgroundColor,
  headerBackgroundMode,
}: Props) {
  const { route, navigation, options, render } = descriptor;

  const {
    header,
    headerBackground,
    headerShown,
    headerTransparent,
    contentStyle,
  } = options;

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

  const [measuredHeaderHeight, setMeasuredHeaderHeight] =
    React.useState<number>();
  const headerHeight =
    header == null
      ? defaultHeaderHeight
      : (measuredHeaderHeight ?? defaultHeaderHeight);

  const headerContainerRef =
    React.useRef<React.ComponentRef<typeof View>>(null);

  const updateHeaderHeight = React.useCallback(
    (height: number) => {
      animatedHeaderHeight.setValue(height);
      setMeasuredHeaderHeight(height);
    },
    [animatedHeaderHeight]
  );

  React.useLayoutEffect(() => {
    animatedHeaderHeight.setValue(headerHeight);
  }, [animatedHeaderHeight, headerHeight]);

  React.useLayoutEffect(() => {
    headerContainerRef.current?.measure((_x, _y, _width, height) => {
      updateHeaderHeight(height);
    });
  }, [updateHeaderHeight]);

  let contentElement: React.ReactNode;

  if (activityMode === 'unmounted') {
    contentElement = null;
  } else {
    const backgroundElement =
      headerShown !== false &&
      headerBackground != null &&
      headerBackgroundMode === 'screen' ? (
        <View
          style={[
            styles.background,
            headerTransparent ? [styles.absolute, styles.elevated] : null,
            { height: headerHeight },
          ]}
        >
          {headerBackground()}
        </View>
      ) : null;

    const headerElement =
      header != null && headerShown !== false ? (
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
            onLayout={(e) => updateHeaderHeight(e.nativeEvent.layout.height)}
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
      ) : null;

    contentElement = (
      <ActivityView mode={activityMode} visible style={styles.content}>
        <AnimatedHeaderHeightContext.Provider value={animatedHeaderHeight}>
          <HeaderHeightContext.Provider
            value={
              headerShown !== false ? headerHeight : (parentHeaderHeight ?? 0)
            }
          >
            {backgroundElement}
            {headerElement}
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
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }, contentStyle]}>
      {contentElement}
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
