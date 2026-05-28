import * as React from 'react';
import {
  GestureDetector as GestureDetectorNative,
  type PanGesture,
  usePanGesture,
} from 'react-native-gesture-handler';

import { GestureHandlerContext } from '../utils/GestureHandlerContext';

export function GestureDetector({
  gesture,
  children,
}: {
  gesture: PanGesture | undefined;
  children: React.ReactNode;
}) {
  if (gesture == null) {
    throw new Error(
      'The provided gesture is undefined. A valid gesture must be passed to the GestureDetector on native platforms.'
    );
  }

  return (
    <GestureHandlerContext.Provider value={gesture}>
      <GestureDetectorNative gesture={gesture}>
        {children}
      </GestureDetectorNative>
    </GestureHandlerContext.Provider>
  );
}

export { usePanGesture };
export type {
  PanGesture,
  PanGestureActiveEvent,
} from 'react-native-gesture-handler';
export { GestureHandlerRootView } from 'react-native-gesture-handler';
