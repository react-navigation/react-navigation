import * as React from 'react';
import { View } from 'react-native';
import type {
  ComposedGesture,
  LongPressGesture,
  LongPressGestureConfig,
  PanGesture,
  PanGestureConfig,
} from 'react-native-gesture-handler';

type GestureDetectorProps = {
  gesture: ComposedGesture | PanGesture | undefined;
  userSelect?: 'none' | 'auto' | 'text';
  children: React.ReactNode;
};

export const GestureDetector = ({
  gesture: _0,
  userSelect: _1,
  children,
}: GestureDetectorProps) => {
  return <>{children}</>;
};

export const GestureHandlerRootView = View;

export function usePanGesture(config: PanGestureConfig) {
  React.useDebugValue(config);

  return undefined;
}

export function useLongPressGesture(config: LongPressGestureConfig) {
  React.useDebugValue(config);

  return undefined;
}

export function useSimultaneousGestures(
  ...gestures: (LongPressGesture | PanGesture | undefined)[]
) {
  React.useDebugValue(gestures);

  return undefined;
}

export type {
  PanGesture,
  PanGestureConfig,
} from 'react-native-gesture-handler';
