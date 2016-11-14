/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  PanResponder,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import TabViewStyleInterpolator from './TabViewStyleInterpolator';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { SceneRendererProps } from './TabViewTypeDefinitions';
import type { GestureEvent, GestureState } from './PanResponderTypes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },

  sheet: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});

type DefaultProps = {
  swipeDistanceThreshold: number;
  swipeVelocityThreshold: number;
}

type Props = SceneRendererProps & {
  swipeEnabled?: boolean;
  swipeDistanceThreshold: number;
  swipeVelocityThreshold: number;
  children?: any;
}

const DEAD_ZONE = 12;

export default class TabViewPagerPan extends Component<DefaultProps, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    swipeEnabled: PropTypes.bool,
    swipeDistanceThreshold: PropTypes.number.isRequired,
    swipeVelocityThreshold: PropTypes.number.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    swipeDistanceThreshold: 120,
    swipeVelocityThreshold: 0.25,
  };

  componentWillMount() {
    this._normalizeSwipeVelocityThreshold();

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

  componentDidUpdate() {
    this._normalizeSwipeVelocityThreshold();
  }

  _normalizeSwipeVelocityThreshold = () => {
    this._swipeVelocityThreshold = this.props.swipeVelocityThreshold;
    if (Platform.OS === 'android') {
      // on Android, velocity is way lower due to timestamp being in nanosecond
      // normalize it to have the same velocity on both iOS and Android
      this._swipeVelocityThreshold /= 1000000;
    }
  };

  _isIndexInRange = (index: number) => {
    const { routes } = this.props.navigationState;
    return (index >= 0 && index <= routes.length - 1);
  };

  _isMovingHorzontally = (evt: GestureEvent, gestureState: GestureState) => {
    return (
      (Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 3)) &&
      (Math.abs(gestureState.vx) > Math.abs(gestureState.vy * 3))
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
    const { index } = this.props.navigationState;
    if (Math.abs(gestureState.dx) > this.props.swipeDistanceThreshold || Math.abs(gestureState.vx) > this._swipeVelocityThreshold) {
      const nextIndex = index - (gestureState.dx / Math.abs(gestureState.dx));
      if (this._isIndexInRange(nextIndex)) {
        return nextIndex;
      }
    }
    return index;
  };

  _canMoveScreen = (evt: GestureEvent, gestureState: GestureState) => {
    const { navigationState: { routes, index } } = this.props;
    if (this.props.swipeEnabled === false) {
      return false;
    }
    const canMove = this._isMovingHorzontally(evt, gestureState) && (
        (gestureState.dx >= DEAD_ZONE && index >= 0) ||
        (gestureState.dx <= -DEAD_ZONE && index <= routes.length - 1)
      );
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
    const currentPosition = typeof this._lastValue === 'number' ? this._lastValue : this.props.navigationState.index;
    const nextPosition = currentPosition - (gestureState.dx / width);
    if (this._isMoving === null) {
      this._isMoving = this._isMovingHorzontally(evt, gestureState);
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
        this.props.jumpToIndex(nextIndex);
      } else {
        this.props.jumpToIndex(currentIndex);
      }
    }
    this._lastValue = null;
    this._isMoving = null;
  };

  _panResponder: any;
  _lastValue = null;
  _isMoving = null;
  _startDirection = 0;
  _swipeVelocityThreshold = 0.25;

  render() {
    const { navigationState, layout } = this.props;
    const { routes } = navigationState;

    const style = TabViewStyleInterpolator.forHorizontal(this.props);

    return (
      <View style={styles.container}>
        <Animated.View style={[ styles.sheet, style, { width: layout.width * routes.length } ]} {...this._panResponder.panHandlers}>
          {this.props.children}
        </Animated.View>
      </View>
    );
  }
}
