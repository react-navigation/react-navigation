import type {
  BottomTabSceneInterpolatedStyle,
  BottomTabSceneInterpolationProps,
} from '../types';

/**
 * Simple cross fade animation
 */
export function forCrossFade({
  current,
}: BottomTabSceneInterpolationProps): BottomTabSceneInterpolatedStyle {
  return {
    sceneStyle: {
      opacity: current.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 1, 0],
      }),
    },
  };
}

/**
 * Animation where the screens slightly shift to left/right
 */
export function forShifting({
  current,
}: BottomTabSceneInterpolationProps): BottomTabSceneInterpolatedStyle {
  return {
    sceneStyle: {
      opacity: current.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 1, 0],
      }),
      transform: [
        {
          translateX: current.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [-50, 0, 50],
          }),
        },
      ],
    },
  };
}
