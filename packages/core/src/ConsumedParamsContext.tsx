import * as React from 'react';

type ConsumedParamsContextValue = {
  isConsumed: (params: object) => boolean;
  setConsumed: (params: object) => void;
};

export const ConsumedParamsContext = React.createContext<
  ConsumedParamsContextValue | undefined
>(undefined);
