import * as React from 'react';
import { Animated } from 'react-native';

export function useAnimatedValueArray(initialValues: number[]) {
  const refs = React.useRef<Animated.Value[]>([]);

  refs.current.length = initialValues.length;
  initialValues.forEach((initialValue, i) => {
    refs.current[i] = refs.current[i] ?? new Animated.Value(initialValue);
  });

  return refs.current;
}
