import * as React from 'react';

export function useLazyValue<T>(create: () => T): T {
  const lazyRef = React.useRef<T>(undefined);

  if (lazyRef.current === undefined) {
    lazyRef.current = create();
  }

  return lazyRef.current;
}
