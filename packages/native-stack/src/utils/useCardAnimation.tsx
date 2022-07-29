import React from 'react';
import { Animated } from 'react-native';
import { useTransitionProgress } from 'react-native-screens';

export default function useCardAnimation() {
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
  };
}
