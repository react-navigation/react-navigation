import * as React from 'react';
import type { Animated } from 'react-native';

export const BottomTabAnimationContext = React.createContext<
  | {
      progress: Animated.AnimatedInterpolation<number>;
    }
  | undefined
>(undefined);
