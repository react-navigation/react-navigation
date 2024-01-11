import * as React from 'react';
import { View } from 'react-native';

const Dummy: any = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const GestureDetector =
  Dummy as typeof import('react-native-gesture-handler').GestureDetector;
export const GestureHandlerRootView = View;

export const Gesture:
  | typeof import('react-native-gesture-handler').Gesture
  | undefined = undefined;

export const enum GestureState {
  UNDETERMINED = 0,
  FAILED = 1,
  BEGAN = 2,
  CANCELLED = 3,
  ACTIVE = 4,
  END = 5,
}
