import * as React from 'react';
import { NavigationState, InitialState } from './types';

type Props = {
  initialState?: InitialState;
  children: React.ReactNode;
};

const MISSING_CONTEXT_ERROR =
  "We couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?";

export const NavigationStateContext = React.createContext<{
  state?: NavigationState | InitialState;
  getState: () => NavigationState | InitialState | undefined;
  setState: (state: NavigationState) => void;
}>({
  get getState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get setState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

export default function NavigationContainer({ initialState, children }: Props) {
  const [state, setState] = React.useState<
    NavigationState | InitialState | undefined
  >(initialState);

  const stateRef = React.useRef(state);

  React.useEffect(() => {
    stateRef.current = state;
  });

  const getState = React.useCallback(() => stateRef.current, []);
  const value = React.useMemo(() => ({ state, getState, setState }), [
    getState,
    state,
  ]);

  return (
    <NavigationStateContext.Provider value={value}>
      {children}
    </NavigationStateContext.Provider>
  );
}
