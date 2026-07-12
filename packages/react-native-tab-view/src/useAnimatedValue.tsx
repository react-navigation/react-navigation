import * as React from 'react';
import { Animated } from 'react-native';

export function useAnimatedValue(initialValue: number): Animated.Value {
  const lazyRef = React.useRef<Animated.Value>(undefined);

  if (lazyRef.current === undefined) {
    lazyRef.current = new Animated.Value(initialValue);
  }

  return lazyRef.current;
}
