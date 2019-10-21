import * as React from 'react';
import Animated from 'react-native-reanimated';

export default React.createContext<Animated.Node<number> | null>(null);
