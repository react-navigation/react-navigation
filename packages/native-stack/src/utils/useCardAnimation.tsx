import { Animated } from 'react-native';
import { useTransitionProgress } from 'react-native-screens';

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
      // p + c - 2 * c * p
      progress: Animated.add(
        progress,
        Animated.add(
          closing,
          Animated.multiply(
            new Animated.Value(-2),
            Animated.multiply(progress, closing)
          )
        )
      ),
    },
    closing,
  };
}
