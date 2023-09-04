import * as React from 'react';
import type Animated from 'react-native-reanimated';

import { DrawerProgressContext } from './DrawerProgressContext';

export function useDrawerProgress():
  | Readonly<Animated.SharedValue<number>>
  | Animated.Node<number> {
  const progress = React.useContext(DrawerProgressContext);

  if (progress === undefined) {
    throw new Error(
      "Couldn't find a drawer. Is your component inside a drawer?"
    );
  }

  return progress;
}
