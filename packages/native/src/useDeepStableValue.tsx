import isEqual from 'fast-deep-equal';
import * as React from 'react';

export function useDeepStableValue<T>(value: T): T {
  const valueRef = React.useRef(value);

  if (!isEqual(valueRef.current, value)) {
    valueRef.current = value;
  }

  return valueRef.current;
}
