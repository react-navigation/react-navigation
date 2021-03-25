import * as React from 'react';
import StackGestureRefContext from './GestureHandlerRefContext';

export default function useGestureHandlerRef() {
  const ref = React.useContext(StackGestureRefContext);

  if (ref === undefined) {
    throw new Error(
      "Couldn't find a ref for gesture handler. Are you inside a screen in Stack?"
    );
  }

  return ref;
}
