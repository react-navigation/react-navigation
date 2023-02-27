import * as React from 'react';
import type Animated from 'react-native-reanimated';

export const DrawerProgressContext = React.createContext<
  Readonly<Animated.SharedValue<number>> | Animated.Node<number> | undefined
>(undefined);
