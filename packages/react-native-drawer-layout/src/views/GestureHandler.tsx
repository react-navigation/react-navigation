import * as React from 'react';
import { View } from 'react-native';

const Dummy: any = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const GestureDetector = Dummy as any; // awkward, but this is not very important

export const GestureHandlerRootView = View;

export const enum GestureState {
  UNDETERMINED = 0,
  FAILED = 1,
  BEGAN = 2,
  CANCELLED = 3,
  ACTIVE = 4,
  END = 5,
}
