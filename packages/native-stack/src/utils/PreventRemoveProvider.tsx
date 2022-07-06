import React from 'react';

type Props = {
  children: React.ReactNode;
};

export const PreventRemoveContext = React.createContext<{
  isPrevented: boolean;
  setPrevented: React.Dispatch<boolean>;
}>({
  isPrevented: false,
  setPrevented: () => {},
});

export function PreventRemoveProvider({ children }: Props) {
  const [isPrevented, setPrevented] = React.useState(false);

  return (
    <PreventRemoveContext.Provider value={{ isPrevented, setPrevented }}>
      {children}
    </PreventRemoveContext.Provider>
  );
}
