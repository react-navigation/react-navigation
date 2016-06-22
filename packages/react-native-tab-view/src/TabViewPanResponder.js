/* @flow */

import type { GestureEvent, GestureState } from './PanResponderTypes';
import type { SceneRendererProps } from './TabViewTypes';

const POSITION_THRESHOLD = 1 / 5;

function forSwipe(props: SceneRendererProps) {
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
    const { width } = props;
    const { index } = props.navigationState;
    const nextPosition = index - (gestureState.dx / width);
    props.position.setValue(nextPosition);
  }

  function finishGesture(evt: GestureEvent, gestureState: GestureState) {
    const nextIndex = getNextIndex(evt, gestureState);
    props.updateIndex(nextIndex);
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
