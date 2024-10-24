import * as React from 'react';

/**
 * usePrevious holds the value from the previous render.
 * Please, do not use it too often.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
