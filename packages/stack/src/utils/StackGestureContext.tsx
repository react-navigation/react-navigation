import * as React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';

export default React.createContext<React.Ref<PanGestureHandler> | null>(null);
