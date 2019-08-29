import * as React from 'react';
import {
  View,
  I18nManager,
  StyleSheet,
  ViewProps,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {
  PanGestureHandler,
  State as GestureState,
} from 'react-native-gesture-handler';
import { TransitionSpec, CardStyleInterpolator, Layout } from '../../types';
import memoize from '../../utils/memoize';
import StackGestureContext from '../../utils/StackGestureContext';
import PointerEventsView from './PointerEventsView';

type Props = ViewProps & {
  index: number;
  active: boolean;
  closing?: boolean;
  transparent?: boolean;
  next?: Animated.Node<number>;
  current: Animated.Value<number>;
  layout: Layout;
  gestureDirection: 'horizontal' | 'vertical';
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
  transitionSpec: {
    open: TransitionSpec;
    close: TransitionSpec;
  };
  styleInterpolator: CardStyleInterpolator;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

type Binary = 0 | 1;

const TRUE = 1;
const FALSE = 0;
const NOOP = 0;
const UNSET = -1;

const DIRECTION_VERTICAL = -1;
const DIRECTION_HORIZONTAL = 1;

const SWIPE_VELOCITY_IMPACT = 0.3;

/**
 * The distance of touch start from the edge of the screen where the gesture will be recognized
 */
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 50;
const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;

const {
  abs,
  add,
  block,
  call,
  cond,
  divide,
  eq,
  greaterThan,
  lessThan,
  max,
  min,
  multiply,
  neq,
  onChange,
  set,
  spring,
  sub,
  timing,
  startClock,
  stopClock,
  clockRunning,
  Clock,
  Value,
} = Animated;

// We need to be prepared for both version of reanimated. With and w/out proc
let memoizedSpring = spring;
// @ts-ignore
if (Animated.proc) {
  // @ts-ignore
  const springHelper = Animated.proc(
    (
      finished: Animated.Value<number>,
      velocity: Animated.Value<number>,
      position: Animated.Value<number>,
      time: Animated.Value<number>,
      prevPosition: Animated.Value<number>,
      toValue: Animated.Adaptable<number>,
      damping: Animated.Adaptable<number>,
      mass: Animated.Adaptable<number>,
      stiffness: Animated.Adaptable<number>,
      overshootClamping: Animated.Adaptable<number>,
      restSpeedThreshold: Animated.Adaptable<number>,
      restDisplacementThreshold: Animated.Adaptable<number>,
      clock: Animated.Clock
    ) =>
      spring(
        clock,
        {
          finished,
          velocity,
          position,
          time,
          // @ts-ignore
          prevPosition,
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

  // @ts-ignore
  memoizedSpring = function(
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
  ) {
    return springHelper(
      state.finished,
      state.velocity,
      state.position,
      state.time,
      new Value(0),
      config.toValue,
      config.damping,
      config.mass,
      config.stiffness,
      config.overshootClamping,
      config.restSpeedThreshold,
      config.restDisplacementThreshold,
      clock
    );
  };
}

export default class Card extends React.Component<Props> {
  static defaultProps = {
    overlayEnabled: Platform.OS !== 'ios',
    shadowEnabled: true,
    gestureEnabled: true,
  };

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
      this.direction.setValue(
        gestureDirection === 'vertical'
          ? DIRECTION_VERTICAL
          : DIRECTION_HORIZONTAL
      );
    }

    if (closing !== prevProps.closing) {
      // If the style updates during render, setting the value here doesn't work
      // We need to defer it a bit so the animation starts properly
      requestAnimationFrame(() =>
        this.isClosing.setValue(closing ? TRUE : FALSE)
      );
    }
  }

  componentWillUnmount(): void {
    // It might sometimes happen than animation will be unmounted
    // during running. However, we need to invoke listener onClose
    // manually in this case
    if (this.isRunningAnimation || this.noAnimationStartedSoFar) {
      if (this.isVisibleValue) {
        this.props.onOpen(false);
      } else {
        this.props.onClose(false);
      }
    }
  }

  private isVisible = new Value<Binary>(TRUE);
  private isVisibleValue: Binary = TRUE;
  private nextIsVisible = new Value<Binary | -1>(UNSET);

  private isClosing = new Value<Binary>(FALSE);
  private noAnimationStartedSoFar = true;
  private isRunningAnimation = false;

  private clock = new Clock();

  private direction = new Value(
    this.props.gestureDirection === 'vertical'
      ? DIRECTION_VERTICAL
      : DIRECTION_HORIZONTAL
  );

  private layout = {
    width: new Value(this.props.layout.width),
    height: new Value(this.props.layout.height),
  };

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

  private toValue = new Value(0);
  private frameTime = new Value(0);

  private transitionVelocity = new Value(0);

  private transitionState = {
    position: this.props.current,
    time: new Value(0),
    finished: new Value(FALSE),
  };

  private handleTransitionEnd = () => {
    this.isRunningAnimation = false;
    this.interpolatedStyle = this.getInterpolatedStyle(
      this.props.styleInterpolator,
      this.props.index,
      this.props.current,
      this.props.next,
      this.props.layout
    );
  };

  private runTransition = (isVisible: Binary | Animated.Node<number>) => {
    const { open: openingSpec, close: closingSpec } = this.props.transitionSpec;

    return cond(eq(this.props.current, isVisible), NOOP, [
      cond(clockRunning(this.clock), NOOP, [
        // Animation wasn't running before
        // Set the initial values and start the clock
        set(this.toValue, isVisible),
        // The velocity value is ideal for translating the whole screen
        // But since we have 0-1 scale, we need to adjust the velocity
        set(
          this.transitionVelocity,
          multiply(
            cond(this.distance, divide(this.velocity, this.distance), 0),
            -1
          )
        ),
        set(this.frameTime, 0),
        set(this.transitionState.time, 0),
        set(this.transitionState.finished, FALSE),
        set(this.isVisible, isVisible),
        startClock(this.clock),
        call([this.isVisible], ([value]: ReadonlyArray<Binary>) => {
          const { onTransitionStart } = this.props;
          this.noAnimationStartedSoFar = false;
          this.isRunningAnimation = true;
          onTransitionStart && onTransitionStart({ closing: !value });
        }),
      ]),
      cond(
        eq(isVisible, 1),
        openingSpec.animation === 'spring'
          ? memoizedSpring(
              this.clock,
              { ...this.transitionState, velocity: this.transitionVelocity },
              { ...openingSpec.config, toValue: this.toValue }
            )
          : timing(
              this.clock,
              { ...this.transitionState, frameTime: this.frameTime },
              { ...openingSpec.config, toValue: this.toValue }
            ),
        closingSpec.animation === 'spring'
          ? memoizedSpring(
              this.clock,
              { ...this.transitionState, velocity: this.transitionVelocity },
              { ...closingSpec.config, toValue: this.toValue }
            )
          : timing(
              this.clock,
              { ...this.transitionState, frameTime: this.frameTime },
              { ...closingSpec.config, toValue: this.toValue }
            )
      ),
      cond(this.transitionState.finished, [
        // Reset values
        set(this.isSwipeGesture, FALSE),
        set(this.gesture, 0),
        set(this.velocity, 0),
        // When the animation finishes, stop the clock
        stopClock(this.clock),
        call([this.isVisible], ([value]: ReadonlyArray<Binary>) => {
          const isOpen = Boolean(value);
          const { onOpen, onClose } = this.props;

          this.handleTransitionEnd();

          if (isOpen) {
            onOpen(true);
          } else {
            onClose(true);
          }
        }),
      ]),
    ]);
  };

  private extrapolatedPosition = add(
    this.gesture,
    multiply(this.velocity, SWIPE_VELOCITY_IMPACT)
  );

  private exec = block([
    onChange(
      this.isClosing,
      cond(this.isClosing, set(this.nextIsVisible, FALSE))
    ),
    onChange(
      this.nextIsVisible,
      cond(neq(this.nextIsVisible, UNSET), [
        // Stop any running animations
        cond(clockRunning(this.clock), [
          call([], this.handleTransitionEnd),
          stopClock(this.clock),
        ]),
        set(this.gesture, 0),
        // Update the index to trigger the transition
        set(this.isVisible, this.nextIsVisible),
        set(this.nextIsVisible, UNSET),
      ])
    ),
    onChange(
      this.isVisible,
      call([this.isVisible], ([isVisible]) => (this.isVisibleValue = isVisible))
    ),
  ]);

  private execNoGesture = this.runTransition(this.isVisible);

  private execWithGesture = block([
    onChange(
      this.isSwiping,
      call(
        [this.isSwiping, this.isSwipeCancelled],
        ([isSwiping, isSwipeCancelled]: readonly Binary[]) => {
          const {
            onGestureBegin,
            onGestureEnd,
            onGestureCanceled,
          } = this.props;

          if (isSwiping === TRUE) {
            onGestureBegin && onGestureBegin();
          } else {
            if (isSwipeCancelled === TRUE) {
              onGestureCanceled && onGestureCanceled();
            } else {
              onGestureEnd && onGestureEnd();
            }
          }
        }
      )
    ),
    cond(
      eq(this.gestureState, GestureState.ACTIVE),
      [
        cond(this.isSwiping, NOOP, [
          // We weren't dragging before, set it to true
          set(this.isSwipeCancelled, FALSE),
          set(this.isSwiping, TRUE),
          set(this.isSwipeGesture, TRUE),
          // Also update the drag offset to the last position
          set(this.offset, this.props.current),
        ]),
        // Update position with next offset + gesture distance
        set(
          this.props.current,
          min(
            max(
              sub(
                this.offset,
                cond(this.distance, divide(this.gesture, this.distance), 1)
              ),
              0
            ),
            1
          )
        ),
        // Stop animations while we're dragging
        // and invoke proper listener
        cond(
          clockRunning(this.clock),
          call([this.toValue], ([target]) => {
            this.isRunningAnimation = false;
            if (target) {
              this.props.onOpen(false);
            } else {
              this.props.onClose(false);
            }
          })
        ),
        stopClock(this.clock),
      ],
      [
        set(
          this.isSwipeCancelled,
          eq(this.gestureState, GestureState.CANCELLED)
        ),
        set(this.isSwiping, FALSE),
        this.runTransition(
          cond(
            greaterThan(
              abs(this.extrapolatedPosition),
              divide(this.distance, 2)
            ),
            cond(
              lessThan(
                cond(eq(this.velocity, 0), this.gesture, this.velocity),
                0
              ),
              TRUE,
              FALSE
            ),
            this.isVisible
          )
        ),
      ]
    ),
  ]);

  private handleGestureEventHorizontal = Animated.event([
    {
      nativeEvent: {
        translationX: (x: Animated.Adaptable<number>) =>
          set(this.gesture, multiply(x, I18nManager.isRTL ? -1 : 1)),
        velocityX: (x: Animated.Adaptable<number>) =>
          set(this.velocity, multiply(x, I18nManager.isRTL ? -1 : 1)),
        state: this.gestureState,
      },
    },
  ]);

  private handleGestureEventVertical = Animated.event([
    {
      nativeEvent: {
        translationY: this.gesture,
        velocityY: this.velocity,
        state: this.gestureState,
      },
    },
  ]);

  // We need to ensure that this style doesn't change unless absolutely needs to
  // Changing it too often will result in huge frame drops due to detaching and attaching
  // Changing it during an animations can result in unexpected results
  private getInterpolatedStyle = memoize(
    (
      styleInterpolator: CardStyleInterpolator,
      index: number,
      current: Animated.Node<number>,
      next: Animated.Node<number> | undefined,
      layout: Layout
    ) =>
      styleInterpolator({
        index,
        progress: {
          current,
          next,
        },
        closing: this.isClosing,
        layouts: {
          screen: layout,
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
    this.props.layout
  );

  private gestureActivationCriteria() {
    const { layout, gestureDirection, gestureResponseDistance } = this.props;

    // Doesn't make sense for a response distance of 0, so this works fine
    const distance =
      gestureDirection === 'vertical'
        ? (gestureResponseDistance && gestureResponseDistance.vertical) ||
          GESTURE_RESPONSE_DISTANCE_VERTICAL
        : (gestureResponseDistance && gestureResponseDistance.horizontal) ||
          GESTURE_RESPONSE_DISTANCE_HORIZONTAL;

    if (gestureDirection === 'vertical') {
      return {
        maxDeltaX: 15,
        minOffsetY: 5,
        hitSlop: { bottom: -layout.height + distance },
      };
    } else {
      const hitSlop = -layout.width + distance;

      if (I18nManager.isRTL) {
        return {
          minOffsetX: -5,
          maxDeltaY: 20,
          hitSlop: { left: hitSlop },
        };
      } else {
        return {
          minOffsetX: 5,
          maxDeltaY: 20,
          hitSlop: { right: hitSlop },
        };
      }
    }
  }

  private gestureRef: React.Ref<PanGestureHandler> = React.createRef();

  render() {
    const {
      active,
      transparent,
      styleInterpolator,
      index,
      current,
      next,
      layout,
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
        layout
      );
    }

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

    return (
      <StackGestureContext.Provider value={this.gestureRef}>
        <View pointerEvents="box-none" {...rest}>
          <Animated.Code exec={this.exec} />
          <Animated.Code
            exec={gestureEnabled ? this.execWithGesture : this.execNoGesture}
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
                {shadowEnabled && shadowStyle && !transparent ? (
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
                  style={[
                    styles.content,
                    transparent ? styles.transparent : styles.opaque,
                    contentStyle,
                  ]}
                >
                  {children}
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
  transparent: {
    backgroundColor: 'transparent',
  },
  opaque: {
    backgroundColor: '#eee',
  },
});
