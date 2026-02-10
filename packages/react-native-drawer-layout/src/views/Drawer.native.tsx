import * as React from 'react';
import {
  Dimensions,
  I18nManager,
  Keyboard,
  type LayoutChangeEvent,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import useLatestCallback from 'use-latest-callback';

import type { DrawerProps } from '../types';
import { DrawerGestureContext } from '../utils/DrawerGestureContext';
import { DrawerProgressContext } from '../utils/DrawerProgressContext';
import { getDrawerWidthNative } from '../utils/getDrawerWidth';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureState,
} from './GestureHandler';
import { Overlay } from './Overlay';

const SWIPE_EDGE_WIDTH = 32;
const SWIPE_MIN_OFFSET = 5;
const SWIPE_MIN_DISTANCE = 60;
const SWIPE_MIN_VELOCITY = 500;

const minmax = (value: number, start: number, end: number) => {
  'worklet';

  return Math.min(Math.max(value, start), end);
};

export function Drawer({
  direction = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr',
  drawerPosition = direction === 'rtl' ? 'right' : 'left',
  drawerStyle,
  drawerType = 'front',
  configureGestureHandler,
  hideStatusBarOnOpen = false,
  keyboardDismissMode = 'on-drag',
  onClose,
  onOpen,
  onGestureStart,
  onGestureCancel,
  onGestureEnd,
  onTransitionStart,
  onTransitionEnd,
  open,
  overlayStyle,
  overlayAccessibilityLabel,
  statusBarAnimation = 'slide',
  swipeEnabled = Platform.OS !== 'web' &&
    Platform.OS !== 'windows' &&
    Platform.OS !== 'macos',
  swipeEdgeWidth = SWIPE_EDGE_WIDTH,
  swipeMinDistance = SWIPE_MIN_DISTANCE,
  swipeMinVelocity = SWIPE_MIN_VELOCITY,
  renderDrawerContent,
  children,
  style,
}: DrawerProps) {
  const { width: customWidth } = StyleSheet.flatten(drawerStyle) || {};

  const isOpen = drawerType === 'permanent' ? true : open;
  const isRight = drawerPosition === 'right';

  const getDrawerTranslationX = React.useCallback(
    (open: boolean, containerWidth: number) => {
      'worklet';

      const drawerWidth = getDrawerWidthNative({
        containerWidth,
        customWidth,
      });

      if (drawerPosition === 'left') {
        return open ? 0 : -drawerWidth;
      }

      return open ? 0 : drawerWidth;
    },
    [customWidth, drawerPosition]
  );

  const hideStatusBar = React.useCallback(
    (hide: boolean) => {
      if (hideStatusBarOnOpen) {
        StatusBar.setHidden(hide, statusBarAnimation);
      }
    },
    [hideStatusBarOnOpen, statusBarAnimation]
  );

  React.useEffect(() => {
    hideStatusBar(isOpen);

    return () => hideStatusBar(false);
  }, [isOpen, hideStatusBarOnOpen, statusBarAnimation, hideStatusBar]);

  const hideKeyboard = useLatestCallback(() => {
    if (keyboardDismissMode === 'on-drag') {
      Keyboard.dismiss();
    }
  });

  const onGestureBegin = useLatestCallback(() => {
    onGestureStart?.();
    hideKeyboard();
    hideStatusBar(true);
  });

  const onGestureFinish = useLatestCallback(() => {
    onGestureEnd?.();
  });

  const onGestureAbort = useLatestCallback(() => {
    onGestureCancel?.();
  });

  const hitSlop = React.useMemo(
    () =>
      isRight
        ? // Extend hitSlop to the side of the screen when drawer is closed
          // This lets the user drag the drawer from the side of the screen
          { right: 0, width: isOpen ? undefined : swipeEdgeWidth }
        : { left: 0, width: isOpen ? undefined : swipeEdgeWidth },
    [isRight, isOpen, swipeEdgeWidth]
  );

  const [initialWidth] = React.useState(() => Dimensions.get('window').width);

  const layoutWidth = useSharedValue(initialWidth);
  const translationX = useSharedValue(
    getDrawerTranslationX(open, initialWidth)
  );

  const contentRef = React.useRef<View>(null);

  React.useLayoutEffect(() => {
    const measureLayout = () => {
      contentRef.current?.measure((_x, _y, width) => {
        layoutWidth.set(width);
        translationX.set(getDrawerTranslationX(open, width));
      });
    };

    measureLayout();

    // FIXME: the layout is off after screen rotation
    // Measure the layout again on screen rotation
    let handle: number | undefined;

    const subscription = Dimensions.addEventListener('change', () => {
      // The measurement is not accurate without the delay
      handle = requestAnimationFrame(() => {
        measureLayout();
      });
    });

    return () => {
      if (handle != null) {
        cancelAnimationFrame(handle);
      }

      subscription.remove();
    };

    // only measure on initial render
    // subsequent updates will be handled by onLayout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLayout = (event: LayoutChangeEvent) => {
    layoutWidth.set(event.nativeEvent.layout.width);
  };

  const touchStartX = useSharedValue(0);
  const touchX = useSharedValue(0);
  const gestureState = useSharedValue<GestureState>(GestureState.UNDETERMINED);

  const onAnimationStart = useLatestCallback((open: boolean) => {
    onTransitionStart?.(!open);
  });

  const onAnimationEnd = useLatestCallback(
    (open: boolean, finished?: boolean) => {
      if (!finished) {
        return;
      }

      onTransitionEnd?.(!open);
    }
  );

  const animatingTo = useSharedValue<'open' | 'close' | null>(null);

  const toggleDrawer = React.useCallback(
    (open: boolean, velocity?: number) => {
      'worklet';

      touchStartX.set(0);
      touchX.set(0);

      const containerWidth = layoutWidth.get();
      const toValue = getDrawerTranslationX(open, containerWidth);

      if (translationX.get() === toValue) {
        return;
      }

      if (animatingTo.get() === (open ? 'open' : 'close')) {
        return;
      }

      if (velocity === undefined) {
        runOnJS(onAnimationStart)(open);
      }

      animatingTo.set(open ? 'open' : 'close');
      translationX.set(
        withSpring(
          toValue,
          {
            velocity,
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            reduceMotion: ReduceMotion.Never,
          },
          (finished) => {
            animatingTo.set(null);
            runOnJS(onAnimationEnd)(open, finished);
          }
        )
      );

      if (open) {
        runOnJS(onOpen)();
      } else {
        runOnJS(onClose)();
      }
    },
    [
      touchStartX,
      touchX,
      layoutWidth,
      getDrawerTranslationX,
      translationX,
      animatingTo,
      onAnimationStart,
      onAnimationEnd,
      onOpen,
      onClose,
    ]
  );

  React.useEffect(() => {
    toggleDrawer(open);
  }, [animatingTo, open, toggleDrawer]);

  const startX = useSharedValue(0);

  const pan = React.useMemo(() => {
    let panGesture = Gesture?.Pan()
      .onBegin((event) => {
        'worklet';

        startX.set(translationX.get());
        gestureState.set(event.state);
        touchStartX.set(event.x);
      })
      .onStart(() => {
        'worklet';

        runOnJS(onGestureBegin)();
      })
      .onChange((event) => {
        'worklet';

        touchX.set(event.x);
        translationX.set(startX.get() + event.translationX);
        gestureState.set(event.state);
      })
      .onEnd((event, success) => {
        'worklet';

        gestureState.set(event.state);

        if (!success) {
          runOnJS(onGestureAbort)();
        }

        const nextOpen =
          (Math.abs(event.translationX) > SWIPE_MIN_OFFSET &&
            Math.abs(event.translationX) > swipeMinVelocity) ||
          Math.abs(event.translationX) > swipeMinDistance
            ? drawerPosition === 'left'
              ? // If swiped to right, open the drawer, otherwise close it
                (event.velocityX === 0 ? event.translationX : event.velocityX) >
                0
              : // If swiped to left, open the drawer, otherwise close it
                (event.velocityX === 0 ? event.translationX : event.velocityX) <
                0
            : open;

        toggleDrawer(nextOpen, event.velocityX);
        runOnJS(onGestureFinish)();
      })
      .activeOffsetX([-SWIPE_MIN_OFFSET, SWIPE_MIN_OFFSET])
      .failOffsetY([-SWIPE_MIN_OFFSET, SWIPE_MIN_OFFSET])
      .hitSlop(hitSlop)
      .enabled(drawerType !== 'permanent' && swipeEnabled);

    if (panGesture && configureGestureHandler) {
      panGesture = configureGestureHandler(panGesture);
    }

    return panGesture;
  }, [
    configureGestureHandler,
    drawerPosition,
    drawerType,
    gestureState,
    hitSlop,
    onGestureBegin,
    onGestureAbort,
    onGestureFinish,
    open,
    startX,
    swipeEnabled,
    swipeMinDistance,
    swipeMinVelocity,
    toggleDrawer,
    touchStartX,
    touchX,
    translationX,
  ]);

  const translateX = useDerivedValue(() => {
    const drawerWidth = getDrawerWidthNative({
      containerWidth: layoutWidth.get(),
      customWidth,
    });

    // Comment stolen from react-native-gesture-handler/DrawerLayout
    //
    // While closing the drawer when user starts gesture outside of its area (in greyed
    // out part of the window), we want the drawer to follow only once finger reaches the
    // edge of the drawer.
    // E.g. on the diagram below drawer is illustrate by X signs and the greyed out area by
    // dots. The touch gesture starts at '*' and moves left, touch path is indicated by
    // an arrow pointing left
    // 1) +---------------+ 2) +---------------+ 3) +---------------+ 4) +---------------+
    //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
    //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
    //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
    //    |XXXXXXXX|......|    |XXXXXXXX|.<-*..|    |XXXXXXXX|<--*..|    |XXXXX|<-----*..|
    //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
    //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
    //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
    //    +---------------+    +---------------+    +---------------+    +---------------+
    //
    // For the above to work properly we define animated value that will keep start position
    // of the gesture. Then we use that value to calculate how much we need to subtract from
    // the translationX. If the gesture started on the greyed out area we take the distance from the
    // edge of the drawer to the start position. Otherwise we don't subtract at all and the
    // drawer be pulled back as soon as you start the pan.
    //
    // This is used only when drawerType is "front"
    const touchDistance =
      drawerType === 'front' && gestureState.get() === GestureState.ACTIVE
        ? minmax(
            drawerPosition === 'left'
              ? touchStartX.get() - drawerWidth
              : layoutWidth.get() - drawerWidth - touchStartX.get(),
            0,
            layoutWidth.get()
          )
        : 0;

    const translateX =
      drawerPosition === 'left'
        ? minmax(translationX.get() + touchDistance, -drawerWidth, 0)
        : minmax(translationX.get() - touchDistance, 0, drawerWidth);

    return translateX;
  });

  const drawerAnimatedStyle = useAnimatedStyle(() => {
    const drawerWidth = getDrawerWidthNative({
      containerWidth: layoutWidth.get(),
      customWidth,
    });

    const distanceFromEdge = layoutWidth.get() - drawerWidth;

    return {
      width: drawerWidth,
      // FIXME: Reanimated skips committing to the shadow tree if no layout props are animated
      // This results in pressables not getting their correct position and can't be pressed
      // So we animate the zIndex to force the commit
      // For 'back' type: always keep drawer behind content (-1 when open, 0 when closed/animating)
      // For other types: 0 when open, 1 when closed/animating
      zIndex:
        drawerType === 'back'
          ? translateX.get() === 0
            ? -1
            : 0
          : translateX.get() === 0
            ? 0
            : 1,
      transform:
        drawerType === 'permanent'
          ? // Reanimated needs the property to be present, but it results in Browser bug
            // https://bugs.chromium.org/p/chromium/issues/detail?id=20574
            []
          : [
              {
                translateX:
                  // The drawer stays in place when `drawerType` is `back`
                  (drawerType === 'back' ? 0 : translateX.get()) +
                  (direction === 'rtl'
                    ? drawerPosition === 'left'
                      ? -distanceFromEdge
                      : 0
                    : drawerPosition === 'left'
                      ? 0
                      : distanceFromEdge),
              },
            ],
    };
  }, [
    customWidth,
    direction,
    drawerPosition,
    drawerType,
    layoutWidth,
    translateX,
  ]);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const drawerWidth = getDrawerWidthNative({
      containerWidth: layoutWidth.get(),
      customWidth,
    });

    return {
      // FIXME: Force Reanimated to commit to the shadow tree
      zIndex: translateX.get() === 0 ? 0 : drawerType === 'back' ? 2 : 1,
      transform:
        drawerType === 'permanent'
          ? // Reanimated needs the property to be present, but it results in Browser bug
            // https://bugs.chromium.org/p/chromium/issues/detail?id=20574
            []
          : [
              {
                translateX:
                  // The screen content stays in place when `drawerType` is `front`
                  drawerType === 'front'
                    ? 0
                    : translateX.get() +
                      drawerWidth * (drawerPosition === 'left' ? 1 : -1),
              },
            ],
    };
  }, [customWidth, drawerPosition, drawerType, layoutWidth, translateX]);

  const progress = useDerivedValue(() => {
    const containerWidth = layoutWidth.get();

    return drawerType === 'permanent'
      ? 1
      : interpolate(
          translateX.get(),
          [
            getDrawerTranslationX(false, containerWidth),
            getDrawerTranslationX(true, containerWidth),
          ],
          [0, 1]
        );
  });

  return (
    <GestureHandlerRootView style={[styles.container, style]}>
      <DrawerProgressContext.Provider value={progress}>
        <DrawerGestureContext.Provider value={pan}>
          <GestureDetector gesture={pan}>
            {/* Immediate child of gesture handler needs to be an Animated.View */}
            <Animated.View
              style={[
                styles.main,
                {
                  flexDirection:
                    drawerType === 'permanent'
                      ? (isRight && direction === 'ltr') ||
                        (!isRight && direction === 'rtl')
                        ? 'row'
                        : 'row-reverse'
                      : 'row',
                },
              ]}
            >
              <Animated.View
                ref={contentRef}
                onLayout={onLayout}
                style={[styles.content, contentAnimatedStyle]}
              >
                <View
                  aria-hidden={isOpen && drawerType !== 'permanent'}
                  style={styles.content}
                >
                  {children}
                </View>
                {drawerType !== 'permanent' ? (
                  <Overlay
                    open={open}
                    progress={progress}
                    onPress={() => toggleDrawer(false)}
                    style={overlayStyle}
                    accessibilityLabel={overlayAccessibilityLabel}
                  />
                ) : null}
              </Animated.View>
              <Animated.View
                removeClippedSubviews={Platform.OS !== 'ios'}
                style={[
                  styles.drawer,
                  {
                    position:
                      drawerType === 'permanent' ? 'relative' : 'absolute',
                  },
                  drawerAnimatedStyle,
                  drawerStyle,
                ]}
              >
                {renderDrawerContent()}
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        </DrawerGestureContext.Provider>
      </DrawerProgressContext.Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawer: {
    top: 0,
    bottom: 0,
    maxWidth: '100%',
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  main: {
    flex: 1,
    ...Platform.select({
      // FIXME: We need to hide `overflowX` on Web so the translated content doesn't show offscreen.
      // But adding `overflowX: 'hidden'` prevents content from collapsing the URL bar.
      web: null,
      default: { overflow: 'hidden' },
    }),
  },
});
