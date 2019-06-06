import * as React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  PanGestureHandler,
  State as GestureState,
} from 'react-native-gesture-handler';
import { TransitionSpec, CardStyleInterpolator, Layout } from '../../types';
import memoize from '../../utils/memoize';
import StackGestureContext from '../../utils/StackGestureContext';

type Props = ViewProps & {
  closing?: boolean;
  transparent?: boolean;
  next?: Animated.Node<number>;
  current: Animated.Value<number>;
  layout: Layout;
  direction: 'horizontal' | 'vertical';
  onOpen: () => void;
  onClose: () => void;
  onTransitionStart?: (props: { closing: boolean }) => void;
  onGestureBegin?: () => void;
  onGestureCanceled?: () => void;
  onGestureEnd?: () => void;
  children: React.ReactNode;
  overlayEnabled: boolean;
  shadowEnabled: boolean;
  gesturesEnabled: boolean;
  gestureResponseDistance?: {
    vertical?: number;
    horizontal?: number;
  };
  transitionSpec: {
    open: TransitionSpec;
    close: TransitionSpec;
  };
  styleInterpolator: CardStyleInterpolator;
};

type Binary = 0 | 1;

const TRUE = 1;
const FALSE = 0;
const NOOP = 0;
const UNSET = -1;

const DIRECTION_VERTICAL = -1;
const DIRECTION_HORIZONTAL = 1;

const SWIPE_VELOCITY_THRESHOLD_DEFAULT = 500;
const SWIPE_DISTANCE_THRESHOLD_DEFAULT = 60;

const SWIPE_DISTANCE_MINIMUM = 5;

/**
 * The distance of touch start from the edge of the screen where the gesture will be recognized
 */
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 50;
const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;

const {
  abs,
  and,
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
  or,
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

export default class Card extends React.Component<Props> {
  static defaultProps = {
    overlayEnabled: true,
    shadowEnabled: true,
    gesturesEnabled: true,
  };

  componentDidUpdate(prevProps: Props) {
    const { layout, direction, closing } = this.props;
    const { width, height } = layout;

    if (width !== prevProps.layout.width) {
      this.layout.width.setValue(width);
    }

    if (height !== prevProps.layout.height) {
      this.layout.height.setValue(height);
    }

    if (direction !== prevProps.direction) {
      this.direction.setValue(
        direction === 'vertical' ? DIRECTION_VERTICAL : DIRECTION_HORIZONTAL
      );
    }

    if (closing !== prevProps.closing) {
      this.isClosing.setValue(closing ? TRUE : FALSE);
    }
  }

  private isVisible = new Value<Binary>(TRUE);
  private nextIsVisible = new Value<Binary | -1>(UNSET);

  private isClosing = new Value<Binary>(FALSE);

  private clock = new Clock();

  private direction = new Value(
    this.props.direction === 'vertical'
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

          onTransitionStart && onTransitionStart({ closing: !value });
        }),
      ]),
      cond(
        eq(isVisible, 1),
        openingSpec.timing === 'spring'
          ? spring(
              this.clock,
              { ...this.transitionState, velocity: this.transitionVelocity },
              { ...openingSpec.config, toValue: this.toValue }
            )
          : timing(
              this.clock,
              { ...this.transitionState, frameTime: this.frameTime },
              { ...openingSpec.config, toValue: this.toValue }
            ),
        closingSpec.timing === 'spring'
          ? spring(
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

          if (isOpen) {
            onOpen();
          } else {
            onClose();
          }
        }),
      ]),
    ]);
  };

  private exec = block([
    onChange(
      this.isClosing,
      cond(this.isClosing, set(this.nextIsVisible, FALSE))
    ),
    onChange(
      this.nextIsVisible,
      cond(neq(this.nextIsVisible, UNSET), [
        // Stop any running animations
        cond(clockRunning(this.clock), stopClock(this.clock)),
        set(this.gesture, 0),
        // Update the index to trigger the transition
        set(this.isVisible, this.nextIsVisible),
        set(this.nextIsVisible, UNSET),
      ])
    ),
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
            or(
              and(
                greaterThan(abs(this.gesture), SWIPE_DISTANCE_MINIMUM),
                greaterThan(
                  abs(this.velocity),
                  SWIPE_VELOCITY_THRESHOLD_DEFAULT
                )
              ),
              cond(
                greaterThan(
                  abs(this.gesture),
                  SWIPE_DISTANCE_THRESHOLD_DEFAULT
                ),
                TRUE,
                FALSE
              )
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
        translationX: this.gesture,
        velocityX: this.velocity,
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
      current: Animated.Node<number>,
      next: Animated.Node<number> | undefined,
      layout: Layout
    ) =>
      styleInterpolator({
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

  private gestureActivationCriteria() {
    const { layout, direction, gestureResponseDistance } = this.props;

    // Doesn't make sense for a response distance of 0, so this works fine
    const distance =
      direction === 'vertical'
        ? (gestureResponseDistance && gestureResponseDistance.vertical) ||
          GESTURE_RESPONSE_DISTANCE_VERTICAL
        : (gestureResponseDistance && gestureResponseDistance.horizontal) ||
          GESTURE_RESPONSE_DISTANCE_HORIZONTAL;

    if (direction === 'vertical') {
      return {
        maxDeltaX: 15,
        minOffsetY: 5,
        hitSlop: { bottom: -layout.height + distance },
      };
    } else {
      return {
        minOffsetX: 5,
        maxDeltaY: 20,
        hitSlop: { right: -layout.width + distance },
      };
    }
  }

  private gestureRef: React.Ref<PanGestureHandler> = React.createRef();

  render() {
    const {
      transparent,
      layout,
      current,
      next,
      direction,
      overlayEnabled,
      shadowEnabled,
      gesturesEnabled,
      children,
      styleInterpolator,
      ...rest
    } = this.props;

    const {
      containerStyle,
      cardStyle,
      overlayStyle,
      shadowStyle,
    } = this.getInterpolatedStyle(styleInterpolator, current, next, layout);

    const handleGestureEvent =
      direction === 'vertical'
        ? this.handleGestureEventVertical
        : this.handleGestureEventHorizontal;

    return (
      <StackGestureContext.Provider value={this.gestureRef}>
        <View pointerEvents="box-none" {...rest}>
          <Animated.Code exec={this.exec} />
          {overlayEnabled && overlayStyle ? (
            <Animated.View
              pointerEvents="none"
              style={[styles.overlay, overlayStyle]}
            />
          ) : null}
          <Animated.View
            style={[styles.container, containerStyle]}
            pointerEvents="box-none"
          >
            <PanGestureHandler
              ref={this.gestureRef}
              enabled={layout.width !== 0 && gesturesEnabled}
              onGestureEvent={handleGestureEvent}
              onHandlerStateChange={handleGestureEvent}
              {...this.gestureActivationCriteria()}
            >
              <Animated.View style={[StyleSheet.absoluteFill, cardStyle]}>
                {shadowEnabled && !transparent ? (
                  <Animated.View
                    style={[styles.shadow, shadowStyle]}
                    pointerEvents="none"
                  />
                ) : null}
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    transparent ? styles.transparent : styles.opaque,
                  ]}
                >
                  {children}
                </View>
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
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  shadow: {
    top: 0,
    left: 0,
    bottom: 0,
    width: 3,
    position: 'absolute',
    backgroundColor: '#fff',
    shadowOffset: { width: -1, height: 1 },
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 1,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  opaque: {
    backgroundColor: '#eee',
  },
});
