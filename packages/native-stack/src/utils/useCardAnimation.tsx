import { Animated } from 'react-native';
import { useTransitionProgress } from 'react-native-screens';

// TODO: move conditional from here and stack to somewhere where it makes sense
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
  next?: {
    /**
     * Animated node representing the progress value of the next screen.
     */
    progress: Animated.AnimatedInterpolation;
  };
  /**
   * Animated node representing whether the card is closing (1 - closing, 0 - not closing).
   */
  closing: Animated.AnimatedInterpolation;
};

export default function useCardAnimation(): NativeStackCardInterpolationProps {
  const { progress, closing } = useTransitionProgress();

  return {
    current: {
      progress: conditional(
        closing,
        Animated.subtract(closing, progress),
        progress
      ),
    },
    closing,
  };
}
