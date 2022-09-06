import { useIsFocused } from '@react-navigation/native';
import { Animated } from 'react-native';
import { useTransitionProgress } from 'react-native-screens';

import conditional from './conditional';

export type NativeStackCardInterpolationProps = {
  /**
   * Values for the current screen.
   */
  current: {
    /**
     * Animated node representing the progress value of the current screen.
     */
    progress: Animated.AnimatedInterpolation;
  };
  /**
   * Values for the screen after this one in the stack.
   * This can be `undefined` in case the screen animating is the last one.
   */
  /**
   * Animated node representing whether the card is closing (1 - closing, 0 - not closing).
   */
  closing: Animated.AnimatedInterpolation;
};

export default function useCardAnimation(): NativeStackCardInterpolationProps {
  const { progress: transitionProgress, closing } = useTransitionProgress();
  const focused = useIsFocused();

  // RNScreens implement transtion progress as always from 0 to 1 in both directions
  // but useCardAnimation from JS Stack uses 0 to 1 on opening and 1 to 0 on closing
  const current = {
    progress: focused
      ? conditional(
          closing,
          Animated.subtract(closing, transitionProgress),
          transitionProgress
        )
      : new Animated.Value(1),
  };

  return {
    current,
    closing,
  };
}
