/* @flow */

import * as React from 'react';
import { StyleSheet, Platform, Keyboard } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { Easing } from 'react-native-reanimated';

import type {
  Layout,
  NavigationState,
  Route,
  Listener,
  PagerCommonProps,
} from './types';

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

const DIRECTION_LEFT = 1;
const DIRECTION_RIGHT = -1;

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

type Props<T: Route> = {|
  ...PagerCommonProps,
  onIndexChange: (index: number) => mixed,
  navigationState: NavigationState<T>,
  layout: Layout,
  children: (props: {|
    // Animated value which represents the state of current index
    // It can include fractional digits as it represents the intermediate value
    position: Animated.Node<number>,
    // Function to actually render the content of the pager
    // The parent component takes care of rendering
    render: (children: React.Node) => React.Node,
    // Add a listener to listen for position updates
    addListener: (type: 'position', listener: Listener) => void,
    // Remove a position listener
    removeListener: (type: 'position', listener: Listener) => void,
    // Callback to call when switching the tab
    // The tab switch animation is performed even if the index in state is unchanged
    jumpTo: (key: string) => void,
  |}) => React.Node,
|};

export default class Pager<T: Route> extends React.Component<Props<T>> {
  static defaultProps = {
    swipeVelocityThreshold: 1200,
  };

  componentDidUpdate(prevProps: Props<T>) {
    const { index } = this.props.navigationState;

    if (
      index !== prevProps.navigationState.index &&
      index !== this._currentIndexValue
    ) {
      // Index has changed in state and it's different from the index being tracked
      // Check for index in state to avoid unintended transition if component updates during swipe
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

  // Clock used for tab transition animations
  _clock = new Clock();

  // Current state of the gesture
  _velocityX = new Value(0);
  _gestureX = new Value(0);
  _gestureState = new Value(State.UNDETERMINED);
  _offsetX = new Value(0);

  // Current position of the page (translateX value)
  _position = new Value(
    // Intial value is based on the index and page width
    this.props.navigationState.index * this.props.layout.width * DIRECTION_RIGHT
  );

  // Initial index of the tabs
  _index = new Value(this.props.navigationState.index);

  // Next index of the tabs, updated for navigation from outside (tab press, state update)
  _nextIndex = new Value(UNSET);

  // Whether the user is currently dragging the screen
  _isSwiping = new Value(FALSE);

  // Whether the update was due to swipe gesture
  // This controls whether the transition will use a spring or timing animation
  // Remember to set it before transition needs to occur
  _isSwipeGesture = new Value(FALSE);

  // Mappings to some prop values
  // We use them in animation calculations, so we need live animated nodes
  _routesLength = new Value(this.props.navigationState.routes.length);
  _layoutWidth = new Value(this.props.layout.width);

  // Threshold values to determine when to trigger a swipe gesture
  _swipeDistanceThreshold = new Value(this.props.swipeDistanceThreshold || 180);
  _swipeVelocityThreshold = new Value(this.props.swipeVelocityThreshold);

  // Whether we need to add a listener for position change
  // To avoid unnecessary traffic through the bridge, don't add listeners unless needed
  _isListening = new Value(FALSE);

  // The current index change caused by the pager's animation
  // The pager is used as a controlled component
  // We need to keep track of the index to determine when to trigger animation
  // The state will change at various points, we should only respond when we are out of sync
  // This will ensure smoother animation and avoid weird glitches
  _currentIndexValue = this.props.navigationState.index;

  // Listeners for the animated value
  _positionListeners: Listener[] = [];

  _jumpToIndex = (index: number) => {
    // If the index changed, we need to trigger a tab switch
    this._isSwipeGesture.setValue(FALSE);
    this._nextIndex.setValue(index);
  };

  _jumpTo = (key: string) => {
    const { navigationState } = this.props;

    const index = navigationState.routes.findIndex(route => route.key === key);

    // A tab switch might occur when we're in the middle of a transition
    // In that case, the index might be same as before
    // So we conditionally make the pager to update the position
    if (navigationState.index === index) {
      this._jumpToIndex(index);
    } else {
      this.props.onIndexChange(index);
    }
  };

  _addListener = (type: string, listener: Listener) => {
    if (type !== 'position') {
      return;
    }

    this._positionListeners.push(listener);
    this._isListening.setValue(TRUE);
  };

  _removeListener = (type: string, listener: Listener) => {
    if (type !== 'position') {
      return;
    }

    const index = this._positionListeners.indexOf(listener);

    if (index > -1) {
      this._positionListeners.splice(index, 1);
    }

    if (this._positionListeners.length === 0) {
      this._isListening.setValue(FALSE);
    }
  };

  _handlePositionChange = ([translateX]: [number]) => {
    // The position value is calculated based on the translate value
    // If we don't have the layout yet, we should return the current index
    const value = this.props.layout.width
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
        set(toValue, multiply(index, this._layoutWidth, DIRECTION_RIGHT)),
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
        // When the animation finishes, stop the clock
        stopClock(this._clock),
        call([this._index], ([value]) => {
          // If the index changed, and previous animation has finished, update state
          this.props.onIndexChange(value);
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
      this._currentIndexValue = value;
    }),
    // Conditionally listen for changes in the position value
    // The position value can changes a lot in short time
    // So we only add a listener when necessary to avoid extra overhead
    cond(
      this._isListening,
      onChange(
        this._position,
        call([this._position], this._handlePositionChange)
      )
    ),
    onChange(
      this._isSwiping,
      // Listen to updates for this value only when it changes
      // Without `onChange`, this will fire even if the value didn't change
      // We don't want to call the listeners if the value didn't change
      call([this._isSwiping], ([value]) => {
        const { keyboardDismissMode, onSwipeStart, onSwipeEnd } = this.props;

        if (value === TRUE) {
          onSwipeStart && onSwipeStart();

          if (keyboardDismissMode === 'on-drag') {
            Keyboard.dismiss();
          }
        } else {
          onSwipeEnd && onSwipeEnd();
        }
      })
    ),
    onChange(
      this._nextIndex,
      cond(neq(this._nextIndex, UNSET), [
        // Stop any running animations
        cond(clockRunning(this._clock), stopClock(this._clock)),
        // Update the index to trigger the transition
        set(this._index, this._nextIndex),
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
          cond(
            and(
              greaterThan(abs(this._gestureX), SWIPE_DISTANCE_MINIMUM),
              or(
                greaterThan(abs(this._gestureX), this._swipeDistanceThreshold),
                greaterThan(abs(this._velocityX), this._swipeVelocityThreshold)
              )
            ),
            // For swipe gesture, to calculate the index, determine direction and add to index
            // When the user swipes towards the left, we transition to the next tab
            // When the user swipes towards the right, we transition to the previous tab
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
                      // If gesture value exceeded the threshold, calculate direction from distance travelled
                      cond(
                        greaterThan(this._gestureX, 0),
                        DIRECTION_LEFT,
                        DIRECTION_RIGHT
                      ),
                      // Otherwise calculate direction from the gesture velocity
                      cond(
                        greaterThan(this._velocityX, 0),
                        DIRECTION_LEFT,
                        DIRECTION_RIGHT
                      )
                    )
                  )
                ),
                sub(this._routesLength, 1)
              )
            ),
            // Index didn't change/changed due to state update
            this._index
          )
        ),
      ]
    ),
    this._position,
  ]);

  render() {
    const { layout, navigationState, swipeEnabled, children } = this.props;

    // Make sure that the translation doesn't exceed the bounds to prevent overscrolling
    const translateX = min(
      max(
        multiply(
          this._layoutWidth,
          sub(this._routesLength, 1),
          DIRECTION_RIGHT
        ),
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
      jumpTo: this._jumpTo,
      render: children => (
        <PanGestureHandler
          enabled={layout.width !== 0 && swipeEnabled}
          onGestureEvent={this._handleGestureEvent}
          onHandlerStateChange={this._handleGestureEvent}
          activeOffsetX={[-SWIPE_DISTANCE_MINIMUM, SWIPE_DISTANCE_MINIMUM]}
          failOffsetY={[-SWIPE_DISTANCE_MINIMUM, SWIPE_DISTANCE_MINIMUM]}
        >
          <Animated.View
            removeClippedSubviews={
              // Clip unfocused views to improve meory usage
              // Don't enable this on iOS where this is buggy and views don't re-appear
              Platform.OS !== 'ios'
            }
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
