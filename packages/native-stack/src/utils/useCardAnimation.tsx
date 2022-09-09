import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import * as React from 'react';
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
  next?: {
    /**
     * Animated node representing the progress value of the next screen.
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

const useIsTransitioning = (): boolean => {
  const [isTransitioning, setTransitioning] = React.useState(false);

  const navigation = useNavigation();

  React.useEffect(() => {
    return navigation.addListener('transitionStart', () => {
      setTransitioning(true);
    });
  }, [navigation]);

  React.useEffect(() => {
    return navigation.addListener('transitionEnd', () => {
      setTransitioning(false);
    });
  }, [navigation]);

  return isTransitioning;
};

export default function useCardAnimation(): NativeStackCardInterpolationProps {
  const [closingValue, setClosingValue] = React.useState(0);
  const [progressValue, setProgressValue] = React.useState(0);
  const [isClosing, setClosing] = React.useState(false);
  const [isForward, setForward] = React.useState(false);

  const {
    progress: transitionProgress,
    closing,
    goingForward,
  } = useTransitionProgress();

  const focused = useIsFocused();
  const isTransitioning = useIsTransitioning();

  closing.addListener(({ value }) => setClosing(value === 1));
  closing.addListener(({ value }) => setClosingValue(value));
  goingForward.addListener(({ value }) => setForward(value === 1));
  transitionProgress.addListener(({ value }) => {
    setProgressValue(value);
  });

  const one = new Animated.Value(1);

  const animate =
    (!isClosing && isForward && !isTransitioning) ||
    (isClosing && !isForward && isTransitioning);

  // RNScreens implement transtion progress as always from 0 to 1 in both directions
  // but useCardAnimation from JS Stack uses 0 to 1 on opening and 1 to 0 on closing
  const current = {
    progress: animate
      ? new Animated.Value(Math.abs(progressValue - closingValue))
      : one,
  };

  const next = {
    progress: focused
      ? one
      : conditional(
          closing,
          transitionProgress,
          Animated.subtract(one, transitionProgress)
        ),
  };

  return {
    current,
    next,
    closing,
  };
}
