import * as React from 'react';

import { GestureHandlerContext } from './GestureHandlerContext';

export function useGestureHandler() {
  const gesture = React.useContext(GestureHandlerContext);

  return gesture;
}
