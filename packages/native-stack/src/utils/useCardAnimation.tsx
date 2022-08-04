import React from 'react';
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
  const [closingValue, setClosingValue] = React.useState<number>(0);
  const [progressValue, setProgressValue] = React.useState<number>(0);

  React.useEffect(() => {
    closing.addListener(({ value }) => setClosingValue(value));
  }, [closing]);

  React.useEffect(() => {
    progress.addListener(({ value }) => setProgressValue(value));
  }, [progress]);

  return {
    current: {
      progress: new Animated.Value(Math.abs(progressValue - closingValue)),
    },
    closing,
  };
}
