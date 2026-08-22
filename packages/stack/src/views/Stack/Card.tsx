import { Color } from '@react-navigation/elements/internal';
import type { LocaleDirection } from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import type { PanGestureConfig } from 'react-native-gesture-handler';
import type { EdgeInsets } from 'react-native-safe-area-context';
import useLatestCallback from 'use-latest-callback';

import type {
  GestureDirection,
  Layout,
  StackCardStyleInterpolator,
  TransitionSpec,
} from '../../types';
import { CardAnimationContext } from '../../utils/CardAnimationContext';
import { gestureActivationCriteria } from '../../utils/gestureActivationCriteria';
import { getDistanceForDirection } from '../../utils/getDistanceForDirection';
import { getInvertedMultiplier } from '../../utils/getInvertedMultiplier';
import { getShadowStyle } from '../../utils/getShadowStyle';
import { GestureDetector, usePanGesture } from '../GestureHandler';
import { CardContent } from './CardContent';

type Props = {
  animated: boolean;
  interpolationIndex: number;
  opening: boolean;
  closing: boolean;
  current: {
    progress: Animated.AnimatedInterpolation<number>;
    closing: Animated.Value;
  };
  next:
    | {
        progress: Animated.AnimatedInterpolation<number>;
        closing: Animated.Value;
      }
    | undefined;
  gesture: Animated.Value;
  layout: Layout;
  insets: EdgeInsets;
  direction: LocaleDirection;
  pageOverflowEnabled: boolean;
  gestureDirection: GestureDirection;
  onOpen: () => void;
  onClose: () => void;
  onTransition: (props: { closing: boolean; gesture: boolean }) => void;
  onGestureBegin: () => void;
  onGestureCanceled: () => void;
  onGestureEnd: () => void;
  children: React.ReactNode;
  overlay:
    | ((props: {
        style: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
      }) => React.ReactNode)
    | undefined;
  overlayEnabled: boolean | undefined;
  shadowEnabled: boolean | undefined;
  gestureEnabled: boolean;
  gestureResponseDistance?: number | undefined;
  gestureVelocityImpact: number | undefined;
  transitionSpec: {
    open: TransitionSpec;
    close: TransitionSpec;
  };
  preloaded: boolean;
  styleInterpolator: StackCardStyleInterpolator;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  contentStyle?: StyleProp<ViewStyle> | undefined;
};

const GESTURE_VELOCITY_IMPACT = 0.3;

const TRUE = 1;
const FALSE = 0;

const useNativeDriver = Platform.OS !== 'web';

const hasOpacityStyle = (
  style: Animated.WithAnimatedValue<StyleProp<ViewStyle>>
) => {
  if (style) {
    const flattenedStyle = StyleSheet.flatten(style);

    return (
      flattenedStyle != null &&
      'opacity' in flattenedStyle &&
      flattenedStyle.opacity != null
    );
  }

  return false;
};

const getAnimateToValue = ({
  closing: isClosing,
  layout: currentLayout,
  gestureDirection: currentGestureDirection,
  direction: currentDirection,
  preloaded: isPreloaded,
}: {
  closing?: boolean;
  layout: Layout;
  gestureDirection: GestureDirection;
  direction: LocaleDirection;
  preloaded: boolean;
}) => {
  if (!isClosing && !isPreloaded) {
    return 0;
  }

  return getDistanceForDirection(
    currentLayout,
    currentGestureDirection,
    currentDirection === 'rtl'
  );
};

const defaultOverlay = ({
  style,
}: {
  style: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
}) => (style ? <Animated.View style={[styles.overlay, style]} /> : null);

function Card({
  shadowEnabled,
  gestureEnabled = true,
  gestureVelocityImpact = GESTURE_VELOCITY_IMPACT,
  overlay = defaultOverlay,
  animated,
  interpolationIndex,
  opening,
  closing,
  next,
  current,
  gesture,
  layout,
  insets,
  direction,
  pageOverflowEnabled,
  gestureDirection,
  onOpen,
  onClose,
  onTransition,
  onGestureBegin,
  onGestureCanceled,
  onGestureEnd,
  children,
  overlayEnabled,
  gestureResponseDistance,
  transitionSpec,
  preloaded,
  styleInterpolator,
  containerStyle: customContainerStyle,
  contentStyle,
}: Props) {
  const didInitiallyAnimate = React.useRef(false);
  const isClosingValueLockedRef = React.useRef(false);
  const lastToValueRef = React.useRef<number | undefined>(undefined);
  const isAnimatingRef = React.useRef(false);
  const animationIdRef = React.useRef(0);

  const animationHandleRef = React.useRef<number | undefined>(undefined);
  const pendingGestureCallbackRef =
    React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const pendingOnCloseCallbackRef =
    React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const [inverted] = React.useState(
    () =>
      new Animated.Value(
        getInvertedMultiplier(gestureDirection, direction === 'rtl')
      )
  );

  const [layoutAnim] = React.useState(() => ({
    width: new Animated.Value(layout.width),
    height: new Animated.Value(layout.height),
  }));

  const [isSwiping] = React.useState(() => new Animated.Value(FALSE));

  const animate = useLatestCallback(
    ({
      closing: isClosingParam,
      velocity,
    }: {
      closing: boolean;
      velocity?: number;
    }) => {
      const id = ++animationIdRef.current;

      const toValue = getAnimateToValue({
        closing: isClosingParam,
        layout,
        gestureDirection,
        direction,
        preloaded,
      });

      lastToValueRef.current = toValue;

      // Switching between open and close mid-gesture and animation can cause a visible jump.
      // So we lock the closing value until the animation is finished.
      if (!isClosingValueLockedRef.current) {
        isClosingValueLockedRef.current = true;
        current.closing.setValue(isClosingParam ? TRUE : FALSE);
      }

      const spec = isClosingParam ? transitionSpec.close : transitionSpec.open;
      const animation =
        spec.animation === 'spring' ? Animated.spring : Animated.timing;

      clearTimeout(pendingGestureCallbackRef.current);

      if (animationHandleRef.current !== undefined) {
        cancelAnimationFrame(animationHandleRef.current);
      }

      onTransition?.({
        closing: isClosingParam,
        gesture: velocity !== undefined,
      });

      const onFinish = () => {
        current.closing.setValue(isClosingParam ? TRUE : FALSE);
        isClosingValueLockedRef.current = false;

        if (isClosingParam) {
          onClose();
        } else {
          onOpen();
        }

        animationHandleRef.current = requestAnimationFrame(() => {
          // Make sure to re-open screen if it wasn't removed
          maybeAnimate();
        });
      };

      if (animated) {
        isAnimatingRef.current = true;

        animation(gesture, {
          ...spec.config,
          velocity,
          toValue,
          useNativeDriver,
          isInteraction: false,
        }).start(({ finished }) => {
          if (id !== animationIdRef.current) {
            return;
          }

          isAnimatingRef.current = false;

          clearTimeout(pendingGestureCallbackRef.current);

          if (finished) {
            onFinish();
          }
        });
      } else {
        isAnimatingRef.current = false;
        gesture.setValue(toValue);
        onFinish();
      }
    }
  );

  React.useLayoutEffect(() => {
    layoutAnim.width.setValue(layout.width);
    layoutAnim.height.setValue(layout.height);
    inverted.setValue(
      getInvertedMultiplier(gestureDirection, direction === 'rtl')
    );
  }, [
    gestureDirection,
    direction,
    inverted,
    layoutAnim.width,
    layoutAnim.height,
    layout.width,
    layout.height,
  ]);

  const previousPropsRef = React.useRef<{
    opening: boolean;
    closing: boolean;
    layout: Layout;
    direction: LocaleDirection;
    gestureDirection: GestureDirection;
    preloaded: boolean;
  } | null>(null);

  React.useEffect(() => {
    const animationIdRefForCleanup = animationIdRef;

    return () => {
      // Increment the animation ID when the card unmounts.
      // This makes pending callbacks return because their IDs no longer match.
      animationIdRefForCleanup.current++;
      gesture.stopAnimation();

      if (animationHandleRef.current) {
        cancelAnimationFrame(animationHandleRef.current);
      }

      clearTimeout(pendingGestureCallbackRef.current);
      clearTimeout(pendingOnCloseCallbackRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [gesture]);

  const maybeAnimate = useLatestCallback(() => {
    clearTimeout(pendingGestureCallbackRef.current);
    clearTimeout(pendingOnCloseCallbackRef.current);

    if (!didInitiallyAnimate.current) {
      // Animate the card in on initial mount
      // Wrap in setTimeout to ensure animation starts after
      // rending of the screen is done. This is especially important
      // in the new architecture
      // cf., https://github.com/react-navigation/react-navigation/issues/12401
      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        didInitiallyAnimate.current = true;
        animate({ closing });
      }, 0);
    } else {
      const previousOpening = previousPropsRef.current?.opening;
      const previousToValue = previousPropsRef.current
        ? getAnimateToValue(previousPropsRef.current)
        : null;

      const toValue = getAnimateToValue({
        closing,
        layout,
        gestureDirection,
        direction,
        preloaded,
      });

      if (previousToValue !== toValue || lastToValueRef.current !== toValue) {
        // We need to trigger the animation when route was closed
        // The route might have been closed by a `POP` action or by a gesture
        // When route was closed due to a gesture, the animation would've happened already
        // It's still important to trigger the animation so that `onClose` is called
        // If `onClose` is not called, cleanup step won't be performed for gestures
        // We also check if animation was already running so we don't restart it unnecessarily
        if (!isAnimatingRef.current || lastToValueRef.current !== toValue) {
          animate({ closing });
        }
      } else if (
        typeof previousOpening === 'boolean' &&
        opening &&
        !previousOpening
      ) {
        // This can happen when screen somewhere below in the stack comes into focus via rearranging
        // Also reset the animated value to make sure that the animation starts from the beginning
        gesture.setValue(
          getDistanceForDirection(layout, gestureDirection, direction === 'rtl')
        );

        animate({ closing });
      }
    }
  });

  React.useEffect(() => {
    if (preloaded) {
      return;
    }

    maybeAnimate();

    previousPropsRef.current = {
      opening,
      closing,
      layout,
      gestureDirection,
      direction,
      preloaded,
    };
  }, [
    animate,
    closing,
    direction,
    gesture,
    gestureDirection,
    layout,
    opening,
    preloaded,
    maybeAnimate,
  ]);

  React.useEffect(() => {
    // Register a no-op listener on the gesture value.
    // When the gesture is updated from the native side (e.g. on iOS swipe-back)
    // with `useNativeDriver`, React Native warns about `onAnimatedValueUpdate`
    // being sent with no listeners registered. Attaching a listener tells the
    // native side that JS is observing the value, silencing the warning.
    // cf. https://github.com/react-navigation/react-navigation/issues/11564
    const id = gesture.addListener(() => {});

    return () => {
      gesture.removeListener(id);
    };
  }, [gesture]);

  const interpolationProps = React.useMemo(
    () => ({
      index: interpolationIndex,
      current,
      next,
      swiping: isSwiping,
      inverted,
      layouts: {
        screen: layout,
      },
      insets: {
        top: insets.top,
        right: insets.right,
        bottom: insets.bottom,
        left: insets.left,
      },
    }),
    [
      interpolationIndex,
      current,
      next,
      isSwiping,
      inverted,
      layout,
      insets.top,
      insets.right,
      insets.bottom,
      insets.left,
    ]
  );

  const { containerStyle, cardStyle, overlayStyle, dimStyle, shadowStyle } =
    React.useMemo(
      () => styleInterpolator(interpolationProps),
      [styleInterpolator, interpolationProps]
    );

  const onGestureActivate: PanGestureConfig['onActivate'] = useLatestCallback(
    () => {
      clearTimeout(pendingGestureCallbackRef.current);
      clearTimeout(pendingOnCloseCallbackRef.current);

      isSwiping.setValue(TRUE);

      if (!isClosingValueLockedRef.current) {
        isClosingValueLockedRef.current = true;
        current.closing.setValue(TRUE);
      }

      onGestureBegin?.();
    }
  );

  const onGestureDeactivate: PanGestureConfig['onDeactivate'] =
    useLatestCallback((event) => {
      isSwiping.setValue(FALSE);

      let distance;
      let translation;
      let velocity;

      if (
        gestureDirection === 'vertical' ||
        gestureDirection === 'vertical-inverted'
      ) {
        distance = layout.height;
        translation = event.translationY;
        velocity = event.velocityY;
      } else {
        distance = layout.width;
        translation = event.translationX;
        velocity = event.velocityX;
      }

      gesture.setValue(translation);

      if (event.canceled) {
        animate({
          closing,
          velocity,
        });

        onGestureCanceled?.();

        return;
      }

      const shouldClose =
        (translation + velocity * gestureVelocityImpact) *
          getInvertedMultiplier(gestureDirection, direction === 'rtl') >
        distance / 2
          ? velocity !== 0 || translation !== 0
          : closing;

      animate({ closing: shouldClose, velocity });

      if (shouldClose) {
        // We call onClose with a delay to make sure that the animation has already started
        // This will make sure that the state update caused by this doesn't affect start of animation
        pendingGestureCallbackRef.current = setTimeout(() => {
          onClose();

          // Check if the screen is still closing with a delay
          // So state update from onClose has a chance to go through
          // If route wasn't removed after onClose, re-open it
          pendingOnCloseCallbackRef.current = setTimeout(() => {
            maybeAnimate();
          }, 32);
        }, 16);
      }

      onGestureEnd?.();
    });

  const onGestureEvent: PanGestureConfig['onUpdate'] = React.useMemo(
    () =>
      gestureEnabled
        ? Animated.event(
            [
              {
                nativeEvent: {
                  handlerData:
                    gestureDirection === 'vertical' ||
                    gestureDirection === 'vertical-inverted'
                      ? { translationY: gesture }
                      : { translationX: gesture },
                },
              },
            ],
            { useNativeDriver }
          )
        : undefined,
    [gesture, gestureDirection, gestureEnabled]
  );

  const panGestureConfig = React.useMemo(
    (): PanGestureConfig => ({
      enabled: layout.width !== 0 && gestureEnabled,
      onActivate: onGestureActivate,
      onDeactivate: onGestureDeactivate,
      onUpdate: onGestureEvent,
      disableReanimated: true,
      useAnimated: true,
      ...gestureActivationCriteria({
        layout,
        direction,
        gestureDirection,
        gestureResponseDistance,
      }),
    }),
    [
      direction,
      gestureDirection,
      gestureEnabled,
      gestureResponseDistance,
      layout,
      onGestureActivate,
      onGestureDeactivate,
      onGestureEvent,
    ]
  );

  const panGesture = usePanGesture(panGestureConfig);

  const backgroundColor = StyleSheet.flatten(contentStyle)?.backgroundColor;

  const isTransparent =
    typeof backgroundColor === 'string'
      ? backgroundColor === 'transparent' ||
        Color(backgroundColor)?.alpha() === 0
      : false;

  return (
    <CardAnimationContext.Provider value={interpolationProps}>
      {Platform.OS !== 'web' ? (
        <Animated.View
          style={{
            // This is a dummy style that doesn't actually change anything visually.
            // Animated needs the animated value to be used somewhere, otherwise things don't update properly.
            // If we disable animations and hide header, it could end up making the value unused.
            // So we have this dummy style that will always be used regardless of what else changed.
            opacity: current.progress,
          }}
          // Make sure that this view isn't removed. If this view is removed, our style with animated value won't apply
          collapsable={false}
        />
      ) : null}
      {(overlayEnabled ?? overlayStyle != null) ? (
        <View style={[StyleSheet.absoluteFill, { pointerEvents: 'box-none' }]}>
          {overlay({ style: overlayStyle })}
        </View>
      ) : null}
      <Animated.View
        style={[styles.container, containerStyle, customContainerStyle]}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View
            needsOffscreenAlphaCompositing={hasOpacityStyle(cardStyle)}
            style={[styles.card, cardStyle]}
          >
            {(shadowEnabled ?? shadowStyle != null) && !isTransparent ? (
              <Animated.View
                style={[
                  styles.shadow,
                  gestureDirection === 'horizontal' ||
                  gestureDirection === 'horizontal-inverted'
                    ? styles.shadowHorizontal
                    : gestureDirection === 'vertical'
                      ? [styles.shadowVertical, styles.shadowTop]
                      : [styles.shadowVertical, styles.shadowBottom],
                  { backgroundColor },
                  shadowStyle,
                ]}
              />
            ) : null}
            <CardContent
              enabled={pageOverflowEnabled}
              layout={layout}
              style={contentStyle}
            >
              {children}
            </CardContent>
            {dimStyle != null ? (
              <Animated.View style={[styles.dim, dimStyle]} />
            ) : null}
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </CardAnimationContext.Provider>
  );
}

export { Card };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    pointerEvents: 'box-none',
  },
  card: {
    flex: 1,
    // The flip animation adds `backfaceVisibility`
    // On Android, it crashes when the style property is removed
    // So we always add the property with the default
    backfaceVisibility: 'visible',
    // This is necessary for gestures to work
    // Without this, gestures won't work if the child view is flattened
    pointerEvents: 'auto',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#000',
    pointerEvents: 'none',
  },
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
    pointerEvents: 'none',
  },
  shadow: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  shadowHorizontal: {
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    ...getShadowStyle({
      offset: {
        width: 0,
        height: -3,
      },
      radius: 12,
      opacity: 0.04,
    }),
  },
  shadowVertical: {
    start: 0,
    end: 0,
    height: 3,
    ...getShadowStyle({
      offset: {
        width: 1,
        height: -1,
      },
      radius: 5,
      opacity: 0.3,
    }),
  },
  shadowTop: {
    top: 0,
  },
  shadowBottom: {
    bottom: 0,
  },
});
