import * as React from 'react';
import {
  PanGestureHandler as PanGestureHandlerNative,
  PanGestureHandlerProperties,
} from 'react-native-gesture-handler';

import GestureHandlerRefContext from '../utils/GestureHandlerRefContext';

export function PanGestureHandler(props: PanGestureHandlerProperties) {
  const gestureRef = React.useRef<PanGestureHandlerNative>(null);

  return (
    <GestureHandlerRefContext.Provider value={gestureRef}>
      <PanGestureHandlerNative {...props} ref={gestureRef} />
    </GestureHandlerRefContext.Provider>
  );
}

export {
  GestureHandlerRootView,
  State as GestureState,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
