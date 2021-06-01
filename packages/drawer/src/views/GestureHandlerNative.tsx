import * as React from 'react';
import {
  PanGestureHandler as PanGestureHandlerNative,
  PanGestureHandlerProperties,
} from 'react-native-gesture-handler';

import DrawerGestureContext from '../utils/DrawerGestureContext';

export function PanGestureHandler(props: PanGestureHandlerProperties) {
  const gestureRef = React.useRef<PanGestureHandlerNative>(null);

  return (
    <DrawerGestureContext.Provider value={gestureRef}>
      <PanGestureHandlerNative {...props} />
    </DrawerGestureContext.Provider>
  );
}

export {
  GestureHandlerRootView,
  State as GestureState,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
} from 'react-native-gesture-handler';
