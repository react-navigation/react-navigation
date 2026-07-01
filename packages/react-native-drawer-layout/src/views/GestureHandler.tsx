import * as React from 'react';
import { View } from 'react-native';
import type {
  PanGesture,
  PanGestureConfig,
} from 'react-native-gesture-handler';

type GestureDetectorProps = {
  gesture: PanGesture | undefined;
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

export type {
  PanGesture,
  PanGestureConfig,
} from 'react-native-gesture-handler';
