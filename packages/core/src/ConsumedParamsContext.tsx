import * as React from 'react';

export const ConsumedParamsContext = React.createContext<
  WeakMap<object, true> | undefined
>(undefined);
