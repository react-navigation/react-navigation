/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  I18nManager,
  PanResponder,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { PagerRendererPropType } from './PropTypes';
import type { PagerRendererProps } from './TypeDefinitions';

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

type Props<T> = PagerRendererProps<T> & {
  swipeDistanceThreshold?: number,
  swipeVelocityThreshold?: number,
};

const DEAD_ZONE = 12;

const DefaultTransitionSpec = {
  timing: Animated.spring,
  tension: 300,
  friction: 35,
};

export default class PagerPan<T: *> extends React.Component<Props<T>> {
  static propTypes = {
    ...PagerRendererPropType,
    swipeDistanceThreshold: PropTypes.number,
    swipeVelocityThreshold: PropTypes.number,
  };

  static defaultProps = {
    canJumpToTab: () => true,
    initialLayout: {
      height: 0,
      width: 0,
    },
  };

  componentDidUpdate(prevProps: Props<T>) {
    this._currentIndex = this.props.navigationState.index;

    if (
      prevProps.navigationState.routes.length !==
        this.props.navigationState.routes.length ||
      prevProps.layout.width !== this.props.layout.width
    ) {
      this._transitionTo(this.props.navigationState.index, false);
    } else if (
      prevProps.navigationState.index !== this.props.navigationState.index
    ) {
      this._transitionTo(this.props.navigationState.index);
    }
  }

  _currentIndex = this.props.navigationState.index;
  _pendingIndex: ?number;

  _isMovingHorizontally = (evt: GestureEvent, gestureState: GestureState) => {
    return (
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2) &&
      Math.abs(gestureState.vx) > Math.abs(gestureState.vy * 2)
    );
  };

  _canMoveScreen = (evt: GestureEvent, gestureState: GestureState) => {
    if (this.props.swipeEnabled === false) {
      return false;
    }

    const {
      navigationState: { routes },
    } = this.props;

    return (
      this._isMovingHorizontally(evt, gestureState) &&
      ((gestureState.dx >= DEAD_ZONE && this._currentIndex > 0) ||
        (gestureState.dx <= -DEAD_ZONE &&
          this._currentIndex < routes.length - 1))
    );
  };

  _startGesture = () => {
    this.props.onSwipeStart && this.props.onSwipeStart();
    this.props.panX.stopAnimation();
  };

  _respondToGesture = (evt: GestureEvent, gestureState: GestureState) => {
    const {
      navigationState: { routes, index },
    } = this.props;

    if (
      // swiping left
      (gestureState.dx > 0 && index <= 0) ||
      // swiping right
      (gestureState.dx < 0 && index >= routes.length - 1)
    ) {
      return;
    }

    this.props.panX.setValue(gestureState.dx);
  };

  _finishGesture = (evt: GestureEvent, gestureState: GestureState) => {
    const {
      navigationState,
      layout,
      swipeDistanceThreshold = layout.width / 1.75,
    } = this.props;

    let { swipeVelocityThreshold = 0.15 } = this.props;

    this.props.onSwipeEnd && this.props.onSwipeEnd();

    if (Platform.OS === 'android') {
      // on Android, velocity is way lower due to timestamp being in nanosecond
      // normalize it to have the same velocity on both iOS and Android
      swipeVelocityThreshold /= 1000000;
    }

    const currentIndex =
      typeof this._pendingIndex === 'number'
        ? this._pendingIndex
        : this._currentIndex;

    let nextIndex = currentIndex;

    if (
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
      Math.abs(gestureState.vx) > Math.abs(gestureState.vy) &&
      (Math.abs(gestureState.dx) > swipeDistanceThreshold ||
        Math.abs(gestureState.vx) > swipeVelocityThreshold)
    ) {
      nextIndex = Math.round(
        Math.min(
          Math.max(
            0,
            currentIndex - gestureState.dx / Math.abs(gestureState.dx)
          ),
          navigationState.routes.length - 1
        )
      );

      this._currentIndex = nextIndex;
    }

    if (
      !isFinite(nextIndex) ||
      !this.props.canJumpToTab({
        route: this.props.navigationState.routes[nextIndex],
      })
    ) {
      nextIndex = currentIndex;
    }

    this._transitionTo(nextIndex);
  };

  _transitionTo = (index: number, animated: boolean = true) => {
    const offset = -index * this.props.layout.width;

    if (this.props.animationEnabled === false || animated === false) {
      this.props.panX.setValue(0);
      this.props.offsetX.setValue(offset);
      return;
    }

    const { timing, ...transitionConfig } = DefaultTransitionSpec;

    Animated.parallel([
      timing(this.props.panX, {
        ...transitionConfig,
        toValue: 0,
      }),
      timing(this.props.offsetX, {
        ...transitionConfig,
        toValue: offset,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        const route = this.props.navigationState.routes[index];
        this.props.jumpTo(route.key);
        this.props.onAnimationEnd && this.props.onAnimationEnd();
        this._pendingIndex = null;
      }
    });

    this._pendingIndex = index;
  };

  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: this._canMoveScreen,
    onMoveShouldSetPanResponderCapture: this._canMoveScreen,
    onPanResponderGrant: this._startGesture,
    onPanResponderMove: this._respondToGesture,
    onPanResponderTerminate: this._finishGesture,
    onPanResponderRelease: this._finishGesture,
    onPanResponderTerminationRequest: () => true,
  });

  render() {
    const { panX, offsetX, navigationState, layout, children } = this.props;
    const { width } = layout;
    const { routes } = navigationState;
    const maxTranslate = width * (routes.length - 1);
    const translateX = Animated.multiply(
      Animated.add(panX, offsetX).interpolate({
        inputRange: [-maxTranslate, 0],
        outputRange: [-maxTranslate, 0],
        extrapolate: 'clamp',
      }),
      I18nManager.isRTL ? -1 : 1
    );

    return (
      <Animated.View
        style={[
          styles.sheet,
          width
            ? {
                width: routes.length * width,
                transform: [{ translateX }],
              }
            : null,
        ]}
        {...this._panResponder.panHandlers}
      >
        {React.Children.map(children, (child, i) => {
          const route = navigationState.routes[i];
          const focused = i === navigationState.index;

          return (
            <View
              key={route.key}
              testID={this.props.getTestID({ route })}
              style={
                width ? { width } : focused ? StyleSheet.absoluteFill : null
              }
            >
              {focused || width ? child : null}
            </View>
          );
        })}
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
