import * as React from 'react';
import type { Animated } from 'react-native';

export const AnimatedHeaderHeightContext = React.createContext<
  Animated.Value | undefined
>(undefined);
