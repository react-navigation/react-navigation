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

// eslint-disable-next-line @eslint-react/hooks-extra/no-unnecessary-use-prefix, @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks
export function usePanGesture(_config: PanGestureConfig) {
  return undefined;
}

export const GestureHandlerRootView = View;

export type {
  PanGesture,
  PanGestureActiveEvent,
} from 'react-native-gesture-handler';
