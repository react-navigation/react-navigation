/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { Easing } from 'react-native-reanimated';

import type { Layout, NavigationState, Route, Listener } from './types';

const {
  Clock,
  Value,
  onChange,
  abs,
  add,
  and,
  block,
  call,
  clockRunning,
  cond,
  divide,
  eq,
  event,
  greaterThan,
  max,
  min,
  multiply,
  neq,
  or,
  round,
  set,
  spring,
  startClock,
  stopClock,
  sub,
  timing,
} = Animated;

const TRUE = 1;
const FALSE = 0;
const NOOP = 0;

const UNSET = -1;

const SWIPE_DISTANCE_MINIMUM = 20;
const SWIPE_DISTANCE_MULTIPLIER = 1 / 1.75;

const SPRING_CONFIG = {
  damping: 30,
  mass: 1,
  stiffness: 200,
  overshootClamping: true,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

const TIMING_CONFIG = {
  duration: 250,
  easing: Easing.out(Easing.cubic),
};

type Props<T: Route> = {
  swipeEnabled: boolean,
  swipeDistanceThreshold?: number,
  swipeVelocityThreshold: number,
  jumpToIndex: (index: number) => mixed,
  navigationState: NavigationState<T>,
  layout: Layout,
  children: (props: {
    position: Animated.Node<number>,
    render: (children: React.Node) => React.Node,
    addListener: (listener: Listener) => void,
    removeListener: (listener: Listener) => void,
    jumpToIndex: (index: number) => void,
  }) => React.Node,
};

export default class Pager<T: Route> extends React.Component<Props<T>> {
  static defaultProps = {
    swipeVelocityThreshold: 1200,
  };

  componentDidUpdate(prevProps: Props<T>) {
    const { index } = this.props.navigationState;

    if (index !== this._currentIndex) {
      this._jumpToIndex(index);
    }

    // Update our mappings of animated nodes when props change
    if (
      prevProps.navigationState.routes.length !==
      this.props.navigationState.routes.length
    ) {
      this._routesLength.setValue(this.props.navigationState.routes.length);
    }

    if (prevProps.layout.width !== this.props.layout.width) {
      this._position.setValue(-index * this.props.layout.width);
      this._layoutWidth.setValue(this.props.layout.width);
    }

    if (this.props.swipeDistanceThreshold != null) {
      if (
        prevProps.swipeDistanceThreshold !== this.props.swipeDistanceThreshold
      ) {
        this._swipeDistanceThreshold.setValue(
          this.props.swipeDistanceThreshold
        );
      }
    } else {
      if (prevProps.layout.width !== this.props.layout.width) {
        this._swipeDistanceThreshold.setValue(
          this.props.layout.width * SWIPE_DISTANCE_MULTIPLIER
        );
      }
    }

    if (
      prevProps.swipeVelocityThreshold !== this.props.swipeVelocityThreshold
    ) {
      this._swipeVelocityThreshold.setValue(this.props.swipeVelocityThreshold);
    }
  }

  _clock = new Clock();

  // Current state of the gesture
  _velocityX = new Value(0);
  _gestureX = new Value(0);
  _gestureState = new Value(State.UNDETERMINED);
  _offsetX = new Value(0);

  // Current position of the page (translateX value)
  _position = new Value(
    // Intial value is based on the index and page width
    -this.props.navigationState.index * this.props.layout.width
  );

  // Initial index of the tabs
  _index = new Value(this.props.navigationState.index);

  // Next index of the tabs, updated for navigation from outside (tab press, state update)
  _nextIndex = new Value(UNSET);

  // Whether the user is currently dragging the screen
  _isSwiping = new Value(FALSE);

  // Whether the update was due to swipe gesture
  // Remember to set it when transition needs to occur
  _isSwipeGesture = new Value(FALSE);

  // Mappings to some prop values
  // We use them in animation calculations, so we need live animated nodes
  _routesLength = new Value(this.props.navigationState.routes.length);
  _layoutWidth = new Value(this.props.layout.width);

  // Thresholde values to determine when to trigger a swipe gesture
  _swipeDistanceThreshold = new Value(this.props.swipeDistanceThreshold || 180);
  _swipeVelocityThreshold = new Value(this.props.swipeVelocityThreshold);

  // Whether we need to add a listener for position change
  // To avoid unnecessary traffic through the bridge, don't add listeners unless needed
  _isListening = new Value(FALSE);

  // The current index change caused by the pager's animation end
  // We store this to skip triggering another transition after state update
  // Otherwise there can be weird glitches when tabs switch quickly
  _currentIndex = this.props.navigationState.index;

  // Listeners for the animated value
  _positionListeners: Listener[] = [];

  _jumpToIndex = (index: number) => {
    // If the index changed, we need to trigger a tab switch
    this._isSwipeGesture.setValue(FALSE);
    this._nextIndex.setValue(index);
  };

  _addListener = (listener: Listener) => {
    this._positionListeners.push(listener);
    this._isListening.setValue(TRUE);
  };

  _removeListener = (listener: Listener) => {
    const index = this._positionListeners.indexOf(listener);

    if (index > -1) {
      this._positionListeners.splice(index, 1);
    }

    if (this._positionListeners.length === 0) {
      this._isListening.setValue(FALSE);
    }
  };

  _handlePositionChange = ([translateX]: [number]) => {
    let value = this.props.layout.width
      ? Math.abs(translateX / this.props.layout.width)
      : this.props.navigationState.index;

    this._positionListeners.forEach(listener => listener(value));
  };

  _transitionTo = (index: Animated.Node<number>) => {
    const toValue = new Value(0);
    const frameTime = new Value(0);

    const state = {
      position: this._position,
      time: new Value(0),
      finished: new Value(FALSE),
    };

    return block([
      cond(clockRunning(this._clock), NOOP, [
        // Animation wasn't running before
        // Set the initial values and start the clock
        set(toValue, multiply(index, this._layoutWidth, -1)),
        set(frameTime, 0),
        set(state.time, 0),
        set(state.finished, FALSE),
        set(this._index, index),
        startClock(this._clock),
      ]),
      cond(
        this._isSwipeGesture,
        // Animate the values with a spring for swipe
        spring(
          this._clock,
          { ...state, velocity: this._velocityX },
          { ...SPRING_CONFIG, toValue }
        ),
        // Otherwise use a timing animation for faster switching
        timing(
          this._clock,
          { ...state, frameTime },
          { ...TIMING_CONFIG, toValue }
        )
      ),
      cond(state.finished, [
        // Reset gesture and velocity from previous gesture
        set(this._gestureX, 0),
        set(this._velocityX, 0),
        // When spring animation finishes, stop the clock
        stopClock(this._clock),
        call([this._index], ([value]) => {
          // If the index changed, and previous spring was finished, update state
          this.props.jumpToIndex(value);
        }),
      ]),
    ]);
  };

  _handleGestureEvent = event([
    {
      nativeEvent: {
        translationX: this._gestureX,
        velocityX: this._velocityX,
        state: this._gestureState,
      },
    },
  ]);

  _translateX = block([
    call([this._index], ([value]) => {
      this._currentIndex = value;
    }),
    cond(this._isListening, call([this._position], this._handlePositionChange)),
    onChange(
      this._nextIndex,
      cond(neq(this._nextIndex, UNSET), [
        // Stop any running animations
        cond(clockRunning(this._clock), stopClock(this._clock)),
        // Update the index to trigger the transition
        set(this._index, this._nextIndex),
        // Unset next index
        set(this._nextIndex, UNSET),
      ])
    ),
    cond(
      eq(this._gestureState, State.ACTIVE),
      [
        cond(this._isSwiping, NOOP, [
          // We weren't dragging before, set it to true
          set(this._isSwiping, TRUE),
          set(this._isSwipeGesture, TRUE),
          // Also update the drag offset to the last position
          set(this._offsetX, this._position),
        ]),
        // Update position with previous offset + gesture distance
        set(this._position, add(this._offsetX, this._gestureX)),
        // Stop animations while we're dragging
        stopClock(this._clock),
      ],
      [
        set(this._isSwiping, FALSE),
        this._transitionTo(
          // Calculate the next index
          cond(
            and(
              greaterThan(abs(this._gestureX), SWIPE_DISTANCE_MINIMUM),
              or(
                greaterThan(abs(this._gestureX), this._swipeDistanceThreshold),
                greaterThan(abs(this._velocityX), this._swipeVelocityThreshold)
              )
            ),
            // For swipe gesture, to calculate the index, determine direction and add to index
            round(
              min(
                max(
                  0,
                  sub(
                    this._index,
                    cond(
                      greaterThan(
                        // Gesture can be positive, or negative
                        // Get absolute for comparision
                        abs(this._gestureX),
                        this._swipeDistanceThreshold
                      ),
                      // If gesture value exceeded the threshold, calculate direction from distance
                      cond(greaterThan(this._gestureX, 0), 1, -1),
                      // Otherwise calculate direction from the gesture velocity
                      cond(greaterThan(this._velocityX, 0), 1, -1)
                    )
                  )
                ),
                sub(this._routesLength, 1)
              )
            ),
            // Otherwise index didn't change/changed due to state update
            this._index
          )
        ),
      ]
    ),
    this._position,
  ]);

  render() {
    const { layout, navigationState, swipeEnabled, children } = this.props;

    const translateX = min(
      max(
        multiply(this._layoutWidth, sub(this._routesLength, 1), -1),
        this._translateX
      ),
      0
    );

    const position = cond(
      this._layoutWidth,
      divide(abs(translateX), this._layoutWidth),
      this._index
    );

    return children({
      position,
      addListener: this._addListener,
      removeListener: this._removeListener,
      jumpToIndex: this._jumpToIndex,
      render: children => (
        <PanGestureHandler
          enabled={layout.width !== 0 && swipeEnabled}
          onGestureEvent={this._handleGestureEvent}
          onHandlerStateChange={this._handleGestureEvent}
          activeOffsetX={[-SWIPE_DISTANCE_MINIMUM, SWIPE_DISTANCE_MINIMUM]}
          failOffsetY={[-SWIPE_DISTANCE_MINIMUM, SWIPE_DISTANCE_MINIMUM]}
        >
          <Animated.View
            style={[
              styles.container,
              layout.width
                ? {
                    width: layout.width * navigationState.routes.length,
                    transform: [{ translateX }],
                  }
                : null,
            ]}
          >
            {children}
          </Animated.View>
        </PanGestureHandler>
      ),
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});
