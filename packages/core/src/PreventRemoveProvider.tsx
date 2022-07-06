import React from 'react';

import PreventRemoveContext from './PreventRemoveContext';

type Props = {
  children: React.ReactNode;
};

export default function PreventRemoveProvider({ children }: Props) {
  const [isPrevented, setPrevented] = React.useState(false);

  return (
    <PreventRemoveContext.Provider value={{ isPrevented, setPrevented }}>
      {children}
    </PreventRemoveContext.Provider>
  );
}
