import * as React from 'react';
import { View } from 'react-native';
import type {
  PanGesture,
  PanGestureConfig,
} from 'react-native-gesture-handler';

import { GestureHandlerContext } from '../utils/GestureHandlerContext';

export function GestureDetector({
  gesture,
  children,
}: {
  gesture: PanGesture | undefined;
  children: React.ReactNode;
}) {
  return (
    <GestureHandlerContext.Provider value={gesture ?? null}>
      {children}
    </GestureHandlerContext.Provider>
  );
}

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix
export function usePanGesture(_config: PanGestureConfig) {
  return undefined;
}

export const GestureHandlerRootView: typeof View = View;

export type { PanGesture } from 'react-native-gesture-handler';
