import * as React from 'react';
import Animated from 'react-native-reanimated';

export default React.createContext<Animated.Value<number>>(
  new Animated.Value(0)
);
