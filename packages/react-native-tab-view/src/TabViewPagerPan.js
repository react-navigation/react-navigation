/* @flow */

import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  PanResponder,
  Platform,
  StyleSheet,
  View,
  I18nManager,
} from 'react-native';
import { SceneRendererPropType } from './TabViewPropTypes';
import type {
  SceneRendererProps,
  Route,
  TransitionConfigurator,
} from './TabViewTypeDefinitions';

type GestureEvent = {
  nativeEvent: {
    changedTouches: Array<*>,
    identifier: number,
    locationX: number,
    locationY: number,
    pageX: number,
    pageY: number,
    target: number,
    timestamp: number,
    touches: Array<*>,
  },
};

type GestureState = {
  stateID: number,
  moveX: number,
  moveY: number,
  x0: number,
  y0: number,
  dx: number,
  dy: number,
  vx: number,
  vy: number,
  numberActiveTouches: number,
};

type DefaultProps = {
  configureTransition: TransitionConfigurator,
  swipeDistanceThreshold: number,
  swipeVelocityThreshold: number,
};

type Props<T> = SceneRendererProps<T> & {
  configureTransition: TransitionConfigurator,
  animationEnabled?: boolean,
  swipeEnabled?: boolean,
  swipeDistanceThreshold: number,
  swipeVelocityThreshold: number,
  children?: React.Element<any>,
};

const DEAD_ZONE = 12;

const DefaultTransitionSpec = {
  timing: Animated.spring,
  tension: 300,
  friction: 35,
};

export default class TabViewPagerPan<T: Route<*>>
  extends PureComponent<DefaultProps, Props<T>, void> {
  static propTypes = {
    ...SceneRendererPropType,
    configureTransition: PropTypes.func.isRequired,
    animationEnabled: PropTypes.bool,
    swipeEnabled: PropTypes.bool,
    swipeDistanceThreshold: PropTypes.number.isRequired,
    swipeVelocityThreshold: PropTypes.number.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    configureTransition: () => DefaultTransitionSpec,
    initialLayout: {
      height: 0,
      width: 0,
    },
    swipeDistanceThreshold: 120,
    swipeVelocityThreshold: 0.25,
  };

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._canMoveScreen,
      onMoveShouldSetPanResponderCapture: this._canMoveScreen,
      onPanResponderGrant: this._startGesture,
      onPanResponderMove: this._respondToGesture,
      onPanResponderTerminate: this._finishGesture,
      onPanResponderRelease: this._finishGesture,
      onPanResponderTerminationRequest: () => true,
    });
  }

  componentDidMount() {
    this._resetListener = this.props.subscribe('reset', this._transitionTo);
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (prevProps.navigationState.index !== this.props.navigationState.index) {
      this._transitionTo(this.props.navigationState.index);
    }
  }

  componentWillUnmount() {
    this._resetListener.remove();
  }

  _panResponder: Object;
  _resetListener: Object;
  _pendingIndex = null;
  _lastValue = null;
  _isMoving = null;
  _startDirection = 0;

  _isIndexInRange = (index: number) => {
    const { routes } = this.props.navigationState;
    return index >= 0 && index <= routes.length - 1;
  };

  _isMovingHorizontally = (evt: GestureEvent, gestureState: GestureState) => {
    return (
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 3) &&
      Math.abs(gestureState.vx) > Math.abs(gestureState.vy * 3)
    );
  };

  _isReverseDirection = (gestureState: GestureState) => {
    if (this._startDirection > 0) {
      return gestureState.vx < 0;
    } else {
      return gestureState.vx > 0;
    }
  };

  _getNextIndex = (evt: GestureEvent, gestureState: GestureState) => {
    const currentIndex = typeof this._pendingIndex === 'number'
      ? this._pendingIndex
      : this.props.navigationState.index;

    let swipeVelocityThreshold = this.props.swipeVelocityThreshold;

    if (Platform.OS === 'android') {
      // on Android, velocity is way lower due to timestamp being in nanosecond
      // normalize it to have the same velocity on both iOS and Android
      swipeVelocityThreshold /= 1000000;
    }

    if (
      Math.abs(gestureState.dx) > this.props.swipeDistanceThreshold ||
      Math.abs(gestureState.vx) > swipeVelocityThreshold
    ) {
      const nextIndex =
        currentIndex -
        gestureState.dx /
          Math.abs(gestureState.dx) *
          (I18nManager.isRTL ? -1 : 1);
      if (this._isIndexInRange(nextIndex)) {
        return nextIndex;
      }
    }
    return currentIndex;
  };

  _canMoveScreen = (evt: GestureEvent, gestureState: GestureState) => {
    if (this.props.swipeEnabled === false) {
      return false;
    }
    const { navigationState: { routes, index } } = this.props;
    const canMove =
      this._isMovingHorizontally(evt, gestureState) &&
      ((gestureState.dx >= DEAD_ZONE && index >= 0) ||
        (gestureState.dx <= -DEAD_ZONE && index <= routes.length - 1));
    if (canMove) {
      this._startDirection = gestureState.dx;
    }
    return canMove;
  };

  _startGesture = () => {
    this._lastValue = this.props.getLastPosition();
    this.props.position.stopAnimation();
  };

  _respondToGesture = (evt: GestureEvent, gestureState: GestureState) => {
    const { layout: { width } } = this.props;
    const currentPosition = typeof this._lastValue === 'number'
      ? this._lastValue
      : this.props.navigationState.index;
    const nextPosition =
      currentPosition - gestureState.dx / width * (I18nManager.isRTL ? -1 : 1);
    if (this._isMoving === null) {
      this._isMoving = this._isMovingHorizontally(evt, gestureState);
    }
    if (this._isMoving && this._isIndexInRange(nextPosition)) {
      this.props.position.setValue(nextPosition);
    }
  };

  _finishGesture = (evt: GestureEvent, gestureState: GestureState) => {
    const currentIndex = this.props.navigationState.index;
    const currentValue = this.props.getLastPosition();
    if (currentValue !== currentIndex) {
      if (this._isMoving && !this._isReverseDirection(gestureState)) {
        const nextIndex = this._getNextIndex(evt, gestureState);
        this._transitionTo(nextIndex);
      } else {
        this._transitionTo(currentIndex);
      }
    }
    this._lastValue = null;
    this._isMoving = null;
  };

  _transitionTo = (toValue: number) => {
    const lastPosition = this.props.getLastPosition();
    const currentTransitionProps = {
      progress: lastPosition,
    };
    const nextTransitionProps = {
      progress: toValue,
    };

    this._pendingIndex = toValue;

    if (this.props.animationEnabled !== false) {
      const transitionSpec = this.props.configureTransition(
        currentTransitionProps,
        nextTransitionProps,
      );
      const { timing, ...transitionConfig } = transitionSpec;

      timing(this.props.position, {
        ...transitionConfig,
        toValue,
      }).start(({ finished }) => {
        if (finished) {
          this.props.jumpToIndex(toValue);
          this._pendingIndex = null;
        }
      });
    } else {
      this.props.position.setValue(toValue);
      this.props.jumpToIndex(toValue);
      this._pendingIndex = null;
    }
  };

  render() {
    const { layout, position, navigationState, children } = this.props;
    const { width } = layout;
    const { routes } = navigationState;

    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x, i) => i)];
    const outputRange = inputRange.map(
      i => width * i * (I18nManager.isRTL ? 1 : -1),
    );

    const translateX = position.interpolate({
      inputRange,
      outputRange,
    });

    return (
      <Animated.View
        style={[
          styles.sheet,
          width
            ? { width: routes.length * width, transform: [{ translateX }] }
            : null,
        ]}
        {...this._panResponder.panHandlers}
      >
        {Children.map(children, (child, i) => (
          <View
            key={navigationState.routes[i].key}
            testID={navigationState.routes[i].testID}
            style={
              width
                ? { width }
                : i === navigationState.index ? StyleSheet.absoluteFill : null
            }
          >
            {i === navigationState.index || width ? child : null}
          </View>
        ))}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});
