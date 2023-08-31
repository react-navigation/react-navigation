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
