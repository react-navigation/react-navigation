import * as React from 'react';
import { View } from 'react-native';
// I think it needs to be imported from compiled types
import type { ComposedGesture } from 'react-native-gesture-handler';
import type { UserSelect } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon';
import type { GestureType } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';
export type { PanGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture';

const Dummy: any = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export type GestureDetectorProps = {
  gesture: GestureType | ComposedGesture;
  userSelect?: UserSelect;
  children?: React.ReactNode;
};

export type MaybeGestureDetectorProps = {
  gesture: GestureType | ComposedGesture | undefined;
  userSelect?: UserSelect;
  children?: React.ReactNode;
};

export const GestureDetector =
  Dummy as React.ComponentType<GestureDetectorProps>;

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
