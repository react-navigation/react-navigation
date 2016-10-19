/* @flow */

import { Platform } from 'react-native';
import type { GestureEvent, GestureState } from './PanResponderTypes';
import type { SceneRendererProps } from './TabViewTypeDefinitions';

type Props = SceneRendererProps & {
  swipeDistanceThreshold: number;
  swipeVelocityThreshold: number;
}

const DEAD_ZONE = 12;

function forHorizontal(props: Props) {
  let { swipeVelocityThreshold } = props;

  if (Platform.OS === 'android') {
    // on Android, velocity is way lower due to timestamp being in nanosecond
    // normalize it to have the same velocity on both iOS and Android
    swipeVelocityThreshold /= 1000000;
  }

  let lastValue = null;
  let isMoving = null;
  let startDirection = 0;

  function isIndexInRange(index: number) {
    const { routes } = props.navigationState;
    return (index >= 0 && index <= routes.length - 1);
  }

  function isMovingHorzontally(evt: GestureEvent, gestureState: GestureState) {
    return (
      (Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 3)) &&
      (Math.abs(gestureState.vx) > Math.abs(gestureState.vy * 3))
    );
  }

  function isReverseDirection(gestureState: GestureState) {
    if (startDirection > 0) {
      return gestureState.vx < 0;
    } else if (startDirection < 0) {
      return gestureState.vx > 0;
    } else {
      return false;
    }
  }

  function getNextIndex(evt: GestureEvent, gestureState: GestureState) {
    const { index } = props.navigationState;
    if (Math.abs(gestureState.dx) > props.swipeDistanceThreshold || Math.abs(gestureState.vx) > swipeVelocityThreshold) {
      const nextIndex = index - (gestureState.dx / Math.abs(gestureState.dx));
      if (isIndexInRange(nextIndex)) {
        return nextIndex;
      }
    }
    return index;
  }

  function canMoveScreen(evt: GestureEvent, gestureState: GestureState) {
    const { routes, index } = props.navigationState;
    const canMove = isMovingHorzontally(evt, gestureState) && (
      (gestureState.dx >= DEAD_ZONE && index >= 0) ||
      (gestureState.dx <= -DEAD_ZONE && index <= routes.length - 1)
    );
    if (canMove) {
      startDirection = gestureState.dx;
    }
    return canMove;
  }

  function startGesture() {
    lastValue = props.getLastPosition();
    props.position.stopAnimation();
  }

  function respondToGesture(evt: GestureEvent, gestureState: GestureState) {
    const { layout: { width } } = props;
    const currentPosition = typeof lastValue === 'number' ? lastValue : props.navigationState.index;
    const nextPosition = currentPosition - (gestureState.dx / width);
    if (isMoving === null) {
      isMoving = isMovingHorzontally(evt, gestureState);
    }
    if (isMoving && isIndexInRange(nextPosition)) {
      props.position.setValue(nextPosition);
    }
  }

  function finishGesture(evt: GestureEvent, gestureState: GestureState) {
    const currentIndex = props.navigationState.index;
    const currentValue = props.getLastPosition();
    if (currentValue !== currentIndex) {
      if (isMoving && !isReverseDirection(gestureState)) {
        const nextIndex = getNextIndex(evt, gestureState);
        props.jumpToIndex(nextIndex);
      } else {
        props.jumpToIndex(currentIndex);
      }
    }
    lastValue = null;
    isMoving = null;
  }

  return {
    onStartShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: canMoveScreen,
    onMoveShouldSetPanResponderCapture: canMoveScreen,
    onPanResponderGrant: startGesture,
    onPanResponderMove: respondToGesture,
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: finishGesture,
    onPanResponderTerminate: finishGesture,
    onShouldBlockNativeResponder: () => false,
  };
}

export default {
  forHorizontal,
};
