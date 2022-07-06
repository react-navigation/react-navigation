import React from 'react';

const PreventRemoveContext = React.createContext<{
  isPrevented: boolean;
  setPrevented: React.Dispatch<boolean> | undefined;
}>({
  isPrevented: false,
  setPrevented: undefined,
});

export default PreventRemoveContext;
