import * as React from 'react';
import type { Animated } from 'react-native';

export const TabAnimationContext = React.createContext<
  Animated.AnimatedInterpolation<number> | undefined
>(undefined);
