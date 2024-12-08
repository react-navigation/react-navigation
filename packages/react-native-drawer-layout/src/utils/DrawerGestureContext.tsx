import * as React from 'react';
import type { PanGesture } from 'react-native-gesture-handler';

export const DrawerGestureContext = React.createContext<PanGesture | undefined>(
  undefined
);
