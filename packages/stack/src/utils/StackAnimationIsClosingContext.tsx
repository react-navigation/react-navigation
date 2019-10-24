import * as React from 'react';
import Animated from 'react-native-reanimated';

export default React.createContext<Animated.Node<0 | 1>>(new Animated.Value(0));
