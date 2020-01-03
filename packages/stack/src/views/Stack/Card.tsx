import * as React from 'react';
import {
  Animated,
  View,
  StyleSheet,
  ViewProps,
  StyleProp,
  ViewStyle,
  Platform,
  InteractionManager,
} from 'react-native';
import {
  PanGestureHandler,
  State as GestureState,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { EdgeInsets } from 'react-native-safe-area-context';
import Color from 'color';
import PointerEventsView from './PointerEventsView';
import StackGestureContext from '../../utils/StackGestureContext';
import StackCardAnimationContext from '../../utils/StackCardAnimationContext';
import getDistanceForDirection from '../../utils/getDistanceForDirection';
import getInvertedMultiplier from '../../utils/getInvertedMultiplier';
import memoize from '../../utils/memoize';
import {
  TransitionSpec,
  StackCardStyleInterpolator,
  GestureDirection,
  Layout,
} from '../../types';

type Props = ViewProps & {
  index: number;
  active: boolean;
  closing?: boolean;
  next?: Animated.AnimatedInterpolation;
  current: Animated.AnimatedInterpolation;
  gesture: Animated.Value;
  layout: Layout;
  insets: EdgeInsets;
  gestureDirection: GestureDirection;
  onOpen: () => void;
  onClose: () => void;
  onTransitionStart?: (props: { closing: boolean }) => void;
  onGestureBegin?: () => void;
  onGestureCanceled?: () => void;
  onGestureEnd?: () => void;
  children: React.ReactNode;
  overlayEnabled: boolean;
  shadowEnabled: boolean;
  gestureEnabled: boolean;
  gestureResponseDistance?: {
    vertical?: number;
    horizontal?: number;
  };
  gestureVelocityImpact: number;
  transitionSpec: {
    open: TransitionSpec;
    close: TransitionSpec;
  };
  styleInterpolator: StackCardStyleInterpolator;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

const GESTURE_VELOCITY_IMPACT = 0.3;

const TRUE = 1;
const FALSE = 0;

/**
 * The distance of touch start from the edge of the screen where the gesture will be recognized
 */
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 50;
const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;

export default class Card extends React.Component<Props> {
  static defaultProps = {
    overlayEnabled: Platform.OS !== 'ios',
    shadowEnabled: true,
    gestureEnabled: true,
    gestureVelocityImpact: GESTURE_VELOCITY_IMPACT,
  };

  componentDidMount() {
    this.animate({ closing: this.props.closing });
  }

  componentDidUpdate(prevProps: Props) {
    const { layout, gestureDirection, closing } = this.props;
    const { width, height } = layout;

    if (width !== prevProps.layout.width) {
      this.layout.width.setValue(width);
    }

    if (height !== prevProps.layout.height) {
      this.layout.height.setValue(height);
    }

    if (gestureDirection !== prevProps.gestureDirection) {
      this.inverted.setValue(getInvertedMultiplier(gestureDirection));
    }

    if (
      this.getAnimateToValue(this.props) !== this.getAnimateToValue(prevProps)
    ) {
      // We need to trigger the animation when route was closed
      // Thr route might have been closed by a `POP` action or by a gesture
      // When route was closed due to a gesture, the animation would've happened already
      // It's still important to trigger the animation so that `onClose` is called
      // If `onClose` is not called, cleanup step won't be performed for gestures
      this.animate({ closing });
    }
  }

  componentWillUnmount() {
    this.handleEndInteraction();
  }

  private isClosing = new Animated.Value(FALSE);

  private inverted = new Animated.Value(
    getInvertedMultiplier(this.props.gestureDirection)
  );

  private layout = {
    width: new Animated.Value(this.props.layout.width),
    height: new Animated.Value(this.props.layout.height),
  };

  private isSwiping = new Animated.Value(FALSE);

  private interactionHandle: number | undefined;

  private animate = ({
    closing,
    velocity,
  }: {
    closing?: boolean;
    velocity?: number;
  }) => {
    const {
      gesture,
      transitionSpec,
      onOpen,
      onClose,
      onTransitionStart,
    } = this.props;

    const toValue = this.getAnimateToValue({
      ...this.props,
      closing,
    });

    const spec = closing ? transitionSpec.close : transitionSpec.open;

    const animation =
      spec.animation === 'spring' ? Animated.spring : Animated.timing;

    this.handleStartInteraction();

    onTransitionStart?.({ closing: Boolean(closing) });
    animation(gesture, {
      isInteraction: false,
      ...spec.config,
      velocity,
      useNativeDriver: true,
      toValue,
    }).start(({ finished }) => {
      this.handleEndInteraction();

      if (finished) {
        if (closing) {
          onClose();
        } else {
          onOpen();
        }
      }
    });
  };

  private getAnimateToValue = ({
    closing,
    layout,
    gestureDirection,
  }: {
    closing?: boolean;
    layout: Layout;
    gestureDirection: GestureDirection;
  }) => {
    if (!closing) {
      return 0;
    }

    return getDistanceForDirection(layout, gestureDirection);
  };

  private handleStartInteraction = () => {
    if (this.interactionHandle === undefined) {
      this.interactionHandle = InteractionManager.createInteractionHandle();
    }
  };

  private handleEndInteraction = () => {
    if (this.interactionHandle !== undefined) {
      InteractionManager.clearInteractionHandle(this.interactionHandle);
      this.interactionHandle = undefined;
    }
  };

  private handleGestureStateChange = ({
    nativeEvent,
  }: PanGestureHandlerGestureEvent) => {
    const {
      layout,
      onGestureBegin,
      onGestureCanceled,
      onGestureEnd,
      gestureDirection,
      gestureVelocityImpact,
    } = this.props;

    switch (nativeEvent.state) {
      case GestureState.BEGAN:
        this.isSwiping.setValue(TRUE);
        this.handleStartInteraction();
        onGestureBegin?.();
        break;
      case GestureState.CANCELLED:
        this.isSwiping.setValue(FALSE);
        this.handleEndInteraction();
        onGestureCanceled?.();
        break;
      case GestureState.END: {
        this.isSwiping.setValue(FALSE);

        let distance;
        let translation;
        let velocity;

        if (
          gestureDirection === 'vertical' ||
          gestureDirection === 'vertical-inverted'
        ) {
          distance = layout.height;
          translation = nativeEvent.translationY;
          velocity = nativeEvent.velocityY;
        } else {
          distance = layout.width;
          translation = nativeEvent.translationX;
          velocity = nativeEvent.velocityX;
        }

        const closing =
          Math.abs(translation + velocity * gestureVelocityImpact) >
          distance / 2
            ? velocity !== 0 || translation !== 0
            : false;

        this.animate({ closing, velocity });
        onGestureEnd?.();
        break;
      }
    }
  };

  // Keep track of the animation context when deps changes.
  private getCardAnimationContext = memoize(
    (
      index: number,
      current: Animated.AnimatedInterpolation,
      next: Animated.AnimatedInterpolation | undefined,
      layout: Layout,
      insetTop: number,
      insetRight: number,
      insetBottom: number,
      insetLeft: number
    ) => ({
      index,
      current: { progress: current },
      next: next && { progress: next },
      closing: this.isClosing,
      swiping: this.isSwiping,
      inverted: this.inverted,
      layouts: {
        screen: layout,
      },
      insets: {
        top: insetTop,
        right: insetRight,
        bottom: insetBottom,
        left: insetLeft,
      },
    })
  );

  private gestureActivationCriteria() {
    const { layout, gestureDirection, gestureResponseDistance } = this.props;

    const distance =
      gestureDirection === 'vertical' ||
      gestureDirection === 'vertical-inverted'
        ? gestureResponseDistance?.vertical !== undefined
          ? gestureResponseDistance.vertical
          : GESTURE_RESPONSE_DISTANCE_VERTICAL
        : gestureResponseDistance?.horizontal !== undefined
        ? gestureResponseDistance.horizontal
        : GESTURE_RESPONSE_DISTANCE_HORIZONTAL;

    if (gestureDirection === 'vertical') {
      return {
        maxDeltaX: 15,
        minOffsetY: 5,
        hitSlop: { bottom: -layout.height + distance },
      };
    } else if (gestureDirection === 'vertical-inverted') {
      return {
        maxDeltaX: 15,
        minOffsetY: -5,
        hitSlop: { top: -layout.height + distance },
      };
    } else {
      const hitSlop = -layout.width + distance;
      const invertedMultiplier = getInvertedMultiplier(gestureDirection);

      if (invertedMultiplier === 1) {
        return {
          minOffsetX: 5,
          maxDeltaY: 20,
          hitSlop: { right: hitSlop },
        };
      } else {
        return {
          minOffsetX: -5,
          maxDeltaY: 20,
          hitSlop: { left: hitSlop },
        };
      }
    }
  }

  private gestureRef: React.Ref<PanGestureHandler> = React.createRef();

  render() {
    const {
      active,
      styleInterpolator,
      index,
      current,
      gesture,
      next,
      layout,
      insets,
      overlayEnabled,
      shadowEnabled,
      gestureEnabled,
      gestureDirection,
      children,
      containerStyle: customContainerStyle,
      contentStyle,
      ...rest
    } = this.props;

    const interpolatedStyle = styleInterpolator({
      index,
      current: { progress: current },
      next: next && { progress: next },
      closing: this.isClosing,
      swiping: this.isSwiping,
      inverted: this.inverted,
      layouts: {
        screen: layout,
      },
      insets,
    });

    const animationContext = this.getCardAnimationContext(
      index,
      current,
      next,
      layout,
      insets.top,
      insets.right,
      insets.bottom,
      insets.left
    );

    const {
      containerStyle,
      cardStyle,
      overlayStyle,
      shadowStyle,
    } = interpolatedStyle;

    const handleGestureEvent = gestureEnabled
      ? Animated.event(
          [
            {
              nativeEvent:
                gestureDirection === 'vertical' ||
                gestureDirection === 'vertical-inverted'
                  ? { translationY: gesture }
                  : { translationX: gesture },
            },
          ],
          { useNativeDriver: true }
        )
      : undefined;

    const { backgroundColor } = StyleSheet.flatten(contentStyle || {});
    const isTransparent = backgroundColor
      ? Color(backgroundColor).alpha() === 0
      : false;

    return (
      <StackGestureContext.Provider value={this.gestureRef}>
        <View pointerEvents="box-none" {...rest}>
          {overlayEnabled && overlayStyle ? (
            <Animated.View
              pointerEvents="none"
              style={[styles.overlay, overlayStyle]}
            />
          ) : null}
          <Animated.View
            style={[styles.container, containerStyle, customContainerStyle]}
            pointerEvents="box-none"
          >
            <PanGestureHandler
              ref={this.gestureRef}
              enabled={layout.width !== 0 && gestureEnabled}
              onGestureEvent={handleGestureEvent}
              onHandlerStateChange={this.handleGestureStateChange}
              {...this.gestureActivationCriteria()}
            >
              <Animated.View style={[styles.container, cardStyle]}>
                {shadowEnabled && shadowStyle && !isTransparent ? (
                  <Animated.View
                    style={[
                      styles.shadow,
                      gestureDirection === 'horizontal'
                        ? styles.shadowHorizontal
                        : styles.shadowVertical,
                      shadowStyle,
                    ]}
                    pointerEvents="none"
                  />
                ) : null}
                <PointerEventsView
                  active={active}
                  progress={current}
                  style={[styles.content, contentStyle]}
                >
                  <StackCardAnimationContext.Provider value={animationContext}>
                    {children}
                  </StackCardAnimationContext.Provider>
                </PointerEventsView>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </View>
      </StackGestureContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  shadow: {
    position: 'absolute',
    backgroundColor: '#fff',
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  shadowHorizontal: {
    top: 0,
    left: 0,
    bottom: 0,
    width: 3,
    shadowOffset: { width: -1, height: 1 },
  },
  shadowVertical: {
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    shadowOffset: { width: 1, height: -1 },
  },
});
