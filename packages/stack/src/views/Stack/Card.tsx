import * as React from 'react';
import {
  View,
  I18nManager,
  StyleSheet,
  ViewProps,
  StyleProp,
  ViewStyle,
  Platform,
  InteractionManager,
} from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { EdgeInsets } from 'react-native-safe-area-context';
import Color from 'color';
import animate, { Binary } from './CardAnimation';
import PointerEventsView from './PointerEventsView';
import memoize from '../../utils/memoize';
import StackGestureContext from '../../utils/StackGestureContext';
import StackCardAnimationContext from '../../utils/StackCardAnimationContext';
import {
  TransitionSpec,
  StackCardStyleInterpolator,
  GestureDirection,
  Layout,
  TimingConfig,
  SpringConfig,
} from '../../types';

type Props = ViewProps & {
  index: number;
  active: boolean;
  closing?: boolean;
  next?: Animated.Node<number>;
  current: Animated.Value<number>;
  layout: Layout;
  insets: EdgeInsets;
  gestureDirection: GestureDirection;
  onOpen: (isFinished: boolean) => void;
  onClose: (isFinished: boolean) => void;
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

type AnimatedSpringConfig = {
  damping: Animated.Value<number>;
  mass: Animated.Value<number>;
  stiffness: Animated.Value<number>;
  restSpeedThreshold: Animated.Value<number>;
  restDisplacementThreshold: Animated.Value<number>;
  overshootClamping: Animated.Value<boolean>;
};

type AnimatedTimingConfig = {
  duration: Animated.Value<number>;
};

const ANIMATION_SPRING = 0;
const ANIMATION_TIMING = 1;

const DIRECTION_VERTICAL = -1;
const DIRECTION_HORIZONTAL = 1;

const GESTURE_VELOCITY_IMPACT = 0.3;

const TRUE = 1;
const FALSE = 0;
const UNSET = -1;

/**
 * The distance of touch start from the edge of the screen where the gesture will be recognized
 */
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 50;
const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;

const {
  clockRunning,
  startClock,
  stopClock,
  spring,
  timing,
  call,
  set,
  multiply,
  cond,
  eq,
  Clock,
  Value,
} = Animated;

const springHelper = Animated.proc(
  (
    clock: Animated.Clock,
    prevPosition: Animated.Value<number>,
    position: Animated.Value<number>,
    finished: Animated.Value<number>,
    velocity: Animated.Value<number>,
    time: Animated.Value<number>,
    toValue: Animated.Adaptable<number>,
    damping: Animated.Adaptable<number>,
    mass: Animated.Adaptable<number>,
    stiffness: Animated.Adaptable<number>,
    overshootClamping: Animated.Adaptable<number>,
    restSpeedThreshold: Animated.Adaptable<number>,
    restDisplacementThreshold: Animated.Adaptable<number>
  ) =>
    spring(
      clock,
      {
        // @ts-ignore
        prevPosition,
        position,
        finished,
        velocity,
        time,
      },
      {
        toValue,
        damping,
        mass,
        stiffness,
        overshootClamping,
        restDisplacementThreshold,
        restSpeedThreshold,
      }
    )
);

const runSpring = (
  clock: Animated.Clock,
  state: {
    finished: Animated.Value<number>;
    velocity: Animated.Value<number>;
    position: Animated.Value<number>;
    time: Animated.Value<number>;
  },
  config: {
    toValue: Animated.Adaptable<number>;
    damping: Animated.Adaptable<number>;
    mass: Animated.Adaptable<number>;
    stiffness: Animated.Adaptable<number>;
    overshootClamping: Animated.Adaptable<boolean>;
    restSpeedThreshold: Animated.Adaptable<number>;
    restDisplacementThreshold: Animated.Adaptable<number>;
  }
) =>
  springHelper(
    clock,
    new Value(0),
    state.position,
    state.finished,
    state.velocity,
    state.time,
    config.toValue,
    config.damping,
    config.mass,
    config.stiffness,
    config.overshootClamping as any,
    config.restSpeedThreshold,
    config.restDisplacementThreshold
  );

function transformSpringConfigToAnimatedValues(
  spec: TransitionSpec,
  current?: AnimatedSpringConfig
): AnimatedSpringConfig {
  if (current) {
    if (spec.animation !== 'spring') {
      return current;
    }

    const { config } = spec;

    current.damping.setValue(config.damping);
    current.stiffness.setValue(config.stiffness);
    current.mass.setValue(config.mass);
    current.restDisplacementThreshold.setValue(
      config.restDisplacementThreshold
    );
    current.restSpeedThreshold.setValue(config.restSpeedThreshold);
    current.overshootClamping.setValue(config.overshootClamping);

    return current;
  } else {
    const config: Partial<SpringConfig> =
      spec.animation !== 'spring' ? {} : spec.config;

    return {
      damping: new Animated.Value(config.damping || 0),
      mass: new Animated.Value(config.mass || 0),
      overshootClamping: new Animated.Value(config.overshootClamping !== false),
      restDisplacementThreshold: new Animated.Value(
        config.restDisplacementThreshold || 0
      ),
      restSpeedThreshold: new Animated.Value(config.restSpeedThreshold || 0),
      stiffness: new Animated.Value(config.stiffness || 0),
    };
  }
}

function transformTimingConfigToAnimatedValues(
  spec: TransitionSpec,
  current?: AnimatedTimingConfig & { easing: Animated.EasingFunction }
): AnimatedTimingConfig & { easing: Animated.EasingFunction } {
  if (current) {
    if (spec.animation !== 'timing') {
      return current;
    }

    const { config } = spec;

    current.duration.setValue(config.duration);

    return current;
  } else {
    const config: Partial<TimingConfig> =
      spec.animation !== 'timing' ? {} : spec.config;

    return {
      duration: new Animated.Value(config.duration || 0),
      easing: config.easing !== undefined ? config.easing : Easing.linear,
    };
  }
}

function getInvertedMultiplier(gestureDirection: GestureDirection): 1 | -1 {
  switch (gestureDirection) {
    case 'vertical':
      return 1;
    case 'vertical-inverted':
      return -1;
    case 'horizontal':
      return I18nManager.isRTL ? -1 : 1;
    case 'horizontal-inverted':
      return I18nManager.isRTL ? 1 : -1;
  }
}

export default class Card extends React.Component<Props> {
  static defaultProps = {
    overlayEnabled: Platform.OS !== 'ios',
    shadowEnabled: true,
    gestureEnabled: true,
    gestureVelocityImpact: GESTURE_VELOCITY_IMPACT,
  };

  componentDidUpdate(prevProps: Props) {
    const {
      layout,
      gestureEnabled,
      gestureDirection,
      gestureVelocityImpact,
      transitionSpec,
      closing,
    } = this.props;
    const { width, height } = layout;

    if (width !== prevProps.layout.width) {
      this.layout.width.setValue(width);
    }

    if (height !== prevProps.layout.height) {
      this.layout.height.setValue(height);
    }

    if (gestureEnabled !== prevProps.gestureEnabled) {
      this.isGestureEnabled.setValue(gestureEnabled ? TRUE : FALSE);
    }

    if (gestureVelocityImpact !== prevProps.gestureVelocityImpact) {
      this.gestureVelocityImpact.setValue(gestureVelocityImpact);
    }

    if (gestureDirection !== prevProps.gestureDirection) {
      this.direction.setValue(
        gestureDirection === 'vertical' ||
          gestureDirection === 'vertical-inverted'
          ? DIRECTION_VERTICAL
          : DIRECTION_HORIZONTAL
      );

      this.inverted.setValue(getInvertedMultiplier(gestureDirection));
    }

    if (transitionSpec.open !== prevProps.transitionSpec.open) {
      if (
        transitionSpec.open.animation !==
        prevProps.transitionSpec.open.animation
      ) {
        this.animationTypeOpen.setValue(
          transitionSpec.open.animation === 'spring'
            ? ANIMATION_SPRING
            : ANIMATION_TIMING
        );
      }

      transformTimingConfigToAnimatedValues(
        transitionSpec.open,
        this.timingConfigOpen
      );

      transformSpringConfigToAnimatedValues(
        transitionSpec.open,
        this.springConfigOpen
      );
    }

    if (transitionSpec.close !== prevProps.transitionSpec.close) {
      if (
        transitionSpec.close.animation !==
        prevProps.transitionSpec.close.animation
      ) {
        this.animationTypeClose.setValue(
          transitionSpec.close.animation === 'spring'
            ? ANIMATION_SPRING
            : ANIMATION_TIMING
        );
      }

      transformTimingConfigToAnimatedValues(
        transitionSpec.close,
        this.timingConfigClose
      );

      transformSpringConfigToAnimatedValues(
        transitionSpec.close,
        this.springConfigClose
      );
    }

    if (closing !== prevProps.closing) {
      // If the style updates during render, setting the value here doesn't work
      // We need to defer it a bit so the animation starts properly
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          this.isClosing.setValue(closing ? TRUE : FALSE)
        )
      );
    }
  }

  componentWillUnmount(): void {
    this.handleEndInteraction();

    // It might sometimes happen than animation will be unmounted
    // during running. However, we need to invoke listener onClose
    // manually in this case
    if (this.isRunningAnimation || this.noAnimationStartedSoFar) {
      this.props.onClose(false);
    }
  }

  private isVisible = new Value<Binary>(TRUE);
  private nextIsVisible = new Value<Binary | -1>(UNSET);

  private animationTypeOpen = new Value<Binary>(
    this.props.transitionSpec.open.animation === 'spring'
      ? ANIMATION_SPRING
      : ANIMATION_TIMING
  );

  private animationTypeClose = new Value<Binary>(
    this.props.transitionSpec.open.animation === 'spring'
      ? ANIMATION_SPRING
      : ANIMATION_TIMING
  );

  private isGestureEnabled = new Value<Binary>(
    this.props.gestureEnabled ? TRUE : FALSE
  );

  private isClosing = new Value<Binary>(FALSE);
  private noAnimationStartedSoFar = true;
  private isRunningAnimation = false;

  private clock = new Clock();

  private direction = new Value(
    this.props.gestureDirection === 'vertical' ||
    this.props.gestureDirection === 'vertical-inverted'
      ? DIRECTION_VERTICAL
      : DIRECTION_HORIZONTAL
  );

  private inverted = new Value(
    getInvertedMultiplier(this.props.gestureDirection)
  );

  private layout = {
    width: new Value(this.props.layout.width),
    height: new Value(this.props.layout.height),
  };

  private gestureVelocityImpact = new Value<number>(
    this.props.gestureVelocityImpact
  );

  private springConfigOpen = transformSpringConfigToAnimatedValues(
    this.props.transitionSpec.open
  );

  private springConfigClose = transformSpringConfigToAnimatedValues(
    this.props.transitionSpec.close
  );

  private timingConfigOpen = transformTimingConfigToAnimatedValues(
    this.props.transitionSpec.open
  );

  private timingConfigClose = transformTimingConfigToAnimatedValues(
    this.props.transitionSpec.close
  );

  private distance = cond(
    eq(this.direction, DIRECTION_VERTICAL),
    this.layout.height,
    this.layout.width
  );

  private gesture = new Value(0);
  private offset = new Value(0);
  private velocity = new Value(0);

  private gestureState = new Value(0);

  private isSwiping = new Value(FALSE);
  private isSwipeCancelled = new Value(FALSE);
  private isSwipeGesture = new Value(FALSE);

  private transitionConfig = {
    time: new Value(0),
    frameTime: new Value(0),
    finished: new Value(FALSE),
    velocity: new Value(0),
  };

  private interactionHandle: number | undefined;

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

  private handleTransitionEnd = () => {
    this.handleEndInteraction();

    this.isRunningAnimation = false;
    this.interpolatedStyle = this.getInterpolatedStyle(
      this.props.styleInterpolator,
      this.props.index,
      this.props.current,
      this.props.next,
      this.props.layout,
      this.props.insets.top,
      this.props.insets.right,
      this.props.insets.bottom,
      this.props.insets.left
    );
  };

  private listenerOnStart = call(
    [this.isVisible],
    ([value]: ReadonlyArray<Binary>) => {
      this.handleStartInteraction();

      const { onTransitionStart } = this.props;
      this.noAnimationStartedSoFar = false;
      this.isRunningAnimation = true;
      onTransitionStart && onTransitionStart({ closing: !value });
    }
  );

  private listenerOnEnd = call(
    [this.isVisible],
    ([value]: ReadonlyArray<Binary>) => {
      const isOpen = Boolean(value);
      const { onOpen, onClose } = this.props;

      this.handleTransitionEnd();

      if (isOpen) {
        onOpen(true);
      } else {
        onClose(true);
      }
    }
  );

  private listenerOnCancel = call([], () => {
    this.isRunningAnimation = false;
  });

  private listenerOnSwipe = call(
    [this.isSwiping, this.isSwipeCancelled],
    ([isSwiping, isSwipeCancelled]: readonly Binary[]) => {
      const { onGestureBegin, onGestureEnd, onGestureCanceled } = this.props;

      if (isSwiping === TRUE) {
        this.handleStartInteraction();

        onGestureBegin && onGestureBegin();
      } else {
        this.handleEndInteraction();

        if (isSwipeCancelled === TRUE) {
          onGestureCanceled && onGestureCanceled();
        } else {
          onGestureEnd && onGestureEnd();
        }
      }
    }
  );

  private listenerOnTransitionEnd = call([], this.handleTransitionEnd);

  private runAnimation = () => {
    const state = {
      position: this.props.current,
      ...this.transitionConfig,
    };

    return cond(
      eq(this.isVisible, TRUE),
      cond(
        eq(this.animationTypeOpen, ANIMATION_SPRING),
        runSpring(this.clock, state, {
          ...this.springConfigOpen,
          toValue: this.isVisible,
        }),
        timing(this.clock, state, {
          ...this.timingConfigOpen,
          toValue: this.isVisible,
        })
      ),
      cond(
        eq(this.animationTypeClose, ANIMATION_SPRING),
        runSpring(this.clock, state, {
          ...this.springConfigClose,
          toValue: this.isVisible,
        }),
        timing(this.clock, state, {
          ...this.timingConfigClose,
          toValue: this.isVisible,
        })
      )
    );
  };

  private exec = animate(
    clockRunning(this.clock),
    startClock(this.clock),
    stopClock(this.clock),
    this.distance,
    this.gesture,
    this.gestureState,
    this.gestureVelocityImpact,
    this.isClosing,
    this.isGestureEnabled,
    this.isSwipeCancelled,
    this.isSwipeGesture,
    this.isSwiping,
    this.isVisible,
    this.listenerOnCancel,
    this.listenerOnEnd,
    this.listenerOnStart,
    this.listenerOnSwipe,
    this.listenerOnTransitionEnd,
    this.nextIsVisible,
    this.offset,
    this.props.current,
    this.runAnimation(),
    this.transitionConfig.finished,
    this.transitionConfig.frameTime,
    this.transitionConfig.time,
    this.transitionConfig.velocity,
    this.velocity
  );

  private handleGestureEventHorizontal = Animated.event([
    {
      nativeEvent: {
        translationX: (x: Animated.Node<number>) =>
          set(this.gesture, multiply(x, this.inverted)),
        velocityX: (x: Animated.Node<number>) =>
          set(this.velocity, multiply(x, this.inverted)),
        state: this.gestureState,
      },
    },
  ]);

  private handleGestureEventVertical = Animated.event([
    {
      nativeEvent: {
        translationY: (y: Animated.Node<number>) =>
          set(this.gesture, multiply(y, this.inverted)),
        velocityY: (y: Animated.Node<number>) =>
          set(this.velocity, multiply(y, this.inverted)),
        state: this.gestureState,
      },
    },
  ]);

  // We need to ensure that this style doesn't change unless absolutely needs to
  // Changing it too often will result in huge frame drops due to detaching and attaching
  // Changing it during an animations can result in unexpected results
  private getInterpolatedStyle = memoize(
    (
      styleInterpolator: StackCardStyleInterpolator,
      index: number,
      current: Animated.Node<number>,
      next: Animated.Node<number> | undefined,
      layout: Layout,
      insetTop: number,
      insetRight: number,
      insetBottom: number,
      insetLeft: number
    ) =>
      styleInterpolator({
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

  // Keep track of the style in a property to avoid changing the animated node when deps change
  // The style shouldn't change in the middle of the animation and should refer to what was there at the start of it
  // Which will be the last value when just before the render which started the animation
  // We need to make sure to update this when the running animation ends
  private interpolatedStyle = this.getInterpolatedStyle(
    this.props.styleInterpolator,
    this.props.index,
    this.props.current,
    this.props.next,
    this.props.layout,
    this.props.insets.top,
    this.props.insets.right,
    this.props.insets.bottom,
    this.props.insets.left
  );

  // Keep track of the animation context when deps changes.
  private getCardAnimationContext = memoize(
    (
      index: number,
      current: Animated.Node<number>,
      next: Animated.Node<number> | undefined,
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
        ? gestureResponseDistance &&
          gestureResponseDistance.vertical !== undefined
          ? gestureResponseDistance.vertical
          : GESTURE_RESPONSE_DISTANCE_VERTICAL
        : gestureResponseDistance &&
          gestureResponseDistance.horizontal !== undefined
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

    if (!this.isRunningAnimation) {
      this.interpolatedStyle = this.getInterpolatedStyle(
        styleInterpolator,
        index,
        current,
        next,
        layout,
        insets.top,
        insets.right,
        insets.bottom,
        insets.left
      );
    }

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
    } = this.interpolatedStyle;

    const handleGestureEvent = gestureEnabled
      ? gestureDirection === 'vertical'
        ? this.handleGestureEventVertical
        : this.handleGestureEventHorizontal
      : undefined;

    const { backgroundColor } = StyleSheet.flatten(contentStyle || {});
    const isTransparent = backgroundColor
      ? Color(backgroundColor).alpha() === 0
      : false;

    return (
      <StackGestureContext.Provider value={this.gestureRef}>
        <View pointerEvents="box-none" {...rest}>
          <Animated.Code
            key={gestureEnabled ? 'gesture-code' : 'no-gesture-code'}
            exec={this.exec}
          />
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
              onHandlerStateChange={handleGestureEvent}
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
                  progress={this.props.current}
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
