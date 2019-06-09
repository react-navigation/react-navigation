import * as React from 'react';
import { NavigationState } from './types';

type Props = {
  initialState?: NavigationState;
  children: React.ReactNode;
};

const MISSING_CONTEXT_ERROR =
  "We couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?";

export const NavigationContext = React.createContext<{
  state?: NavigationState;
  setState: (state: NavigationState) => void;
}>({
  get state(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get setState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

export default function NavigationContainer({ initialState, children }: Props) {
  const [state, setState] = React.useState<NavigationState | undefined>(
    initialState
  );
  const value = React.useMemo(() => ({ state, setState }), [state, setState]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}
