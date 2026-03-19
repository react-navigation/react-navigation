import * as React from 'react';

type ConsumedParamsContextValue = {
  ref: WeakRef<object> | null;
  setRef: (ref: WeakRef<object>) => void;
};

export const ConsumedParamsContext = React.createContext<
  ConsumedParamsContextValue | undefined
>(undefined);
