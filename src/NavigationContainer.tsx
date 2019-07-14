import * as React from 'react';
import EnsureSingleNavigator from './EnsureSingleNavigator';
import { NavigationState, PartialState } from './types';

type Props = {
  initialState?: PartialState;
  onStateChange?: (state: NavigationState | PartialState) => void;
  children: React.ReactNode;
};

const MISSING_CONTEXT_ERROR =
  "We couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?";

export const NavigationStateContext = React.createContext<{
  state?: NavigationState | PartialState;
  getState: () => NavigationState | PartialState | undefined;
  setState: (state: NavigationState) => void;
}>({
  get getState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get setState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

export default function NavigationContainer({
  initialState,
  onStateChange,
  children,
}: Props) {
  const [state, setState] = React.useState<
    NavigationState | PartialState | undefined
  >(initialState);

  const stateRef = React.useRef(state);

  React.useEffect(() => {
    stateRef.current = state;

    if (onStateChange && state !== undefined) {
      onStateChange(state);
    }
  }, [onStateChange, state]);

  const getState = React.useCallback(() => stateRef.current, []);
  const value = React.useMemo(() => ({ state, getState, setState }), [
    getState,
    state,
  ]);

  return (
    <NavigationStateContext.Provider value={value}>
      <EnsureSingleNavigator>{children}</EnsureSingleNavigator>
    </NavigationStateContext.Provider>
  );
}
