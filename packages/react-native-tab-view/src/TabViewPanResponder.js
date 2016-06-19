/* @flow */

import {
  Animated,
  Easing,
} from 'react-native';
import type { GestureEvent, GestureState } from './PanResponderTypes';
import type { NavigationState } from './TabViewTypes';

type Props = {
  width: number;
  navigationState: NavigationState;
  position: Animated.Value;
  updateIndex: Function;
  updatePosition: Function;
}

const POSITION_THRESHOLD = 1 / 5;

function forSwipe(props: Props) {
  function calculateLeftOffset(index: number) {
    const { width } = props;
    return width * index * -1;
  }

  function getNextIndex(evt: GestureEvent, gestureState: GestureState) {
    const { scenes, index } = props.navigationState;
    if (Math.abs(gestureState.dx) > (props.width * POSITION_THRESHOLD)) {
      const nextIndex = index - (gestureState.dx / Math.abs(gestureState.dx));
      if (nextIndex >= 0 && nextIndex < scenes.length) {
        return nextIndex;
      }
    }
    return index;
  }

  function canMoveScreen(evt: GestureEvent, gestureState: GestureState) {
    const { scenes, index } = props.navigationState;
    return (
      (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) &&
      (gestureState.dx > 0 && index !== 0) ||
      (gestureState.dx < 0 && index !== scenes.length - 1)
    );
  }

  function respondToGesture(evt: GestureEvent, gestureState: GestureState) {
    const { index } = props.navigationState;
    const offsetLeft = calculateLeftOffset(index) + gestureState.dx;
    props.position.setValue(offsetLeft);
  }

  function finishGesture(evt: GestureEvent, gestureState: GestureState) {
    const { index } = props.navigationState;
    const nextIndex = getNextIndex(evt, gestureState);
    if (index !== nextIndex) {
      const multiplier = Math.max(Math.min(Math.abs(gestureState.vx), 1), 0.5);
      Animated.timing(props.position, {
        toValue: calculateLeftOffset(nextIndex),
        duration: 300 * multiplier,
        easing: Easing.easeOut,
      }).start(() => {
        props.updateIndex(nextIndex);
      });
    } else {
      props.updatePosition();
    }
  }

  return {
    onMoveShouldSetPanResponder: (evt: GestureEvent, gestureState: GestureState) => {
      return canMoveScreen(evt, gestureState);
    },
    onMoveShouldSetPanResponderCapture: (evt: GestureEvent, gestureState: GestureState) => {
      return canMoveScreen(evt, gestureState);
    },
    onPanResponderMove: (evt: GestureEvent, gestureState: GestureState) => {
      respondToGesture(evt, gestureState);
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: (evt: GestureEvent, gestureState: GestureState) => {
      finishGesture(evt, gestureState);
    },
    onPanResponderTerminate: (evt: GestureEvent, gestureState: GestureState) => {
      finishGesture(evt, gestureState);
    },
  };
}

export default {
  POSITION_THRESHOLD,
  forSwipe,
};
