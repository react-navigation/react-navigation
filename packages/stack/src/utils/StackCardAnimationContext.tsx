import * as React from 'react';
import Animated from 'react-native-reanimated';
import { Layout } from '../types';

type StackCardAnimationContextType = {
  current: { progress: Animated.Node<number> };
  next?: { progress: Animated.Node<number> };
  index: number;
  closing: Animated.Node<0 | 1>;
  swiping: Animated.Node<0 | 1>;
  layouts: {
    screen: Layout;
  };
  insets: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};

export default React.createContext<StackCardAnimationContextType | undefined>(
  undefined
);
