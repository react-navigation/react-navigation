import * as React from 'react';
import EnsureSingleNavigator from './EnsureSingleNavigator';
import { NavigationState, PartialState } from './types';

type Props = {
  initialState?: PartialState;
  onStateChange?: (state: NavigationState | PartialState | undefined) => void;
  children: React.ReactNode;
};

type State = {
  navigationState: NavigationState | PartialState | undefined;
};

const MISSING_CONTEXT_ERROR =
  "We couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?";

export const NavigationStateContext = React.createContext<{
  state?: NavigationState | PartialState;
  getState: () => NavigationState | PartialState | undefined;
  setState: (state: NavigationState | undefined) => void;
  key?: string;
  performTransaction: (action: () => void) => void;
}>({
  get getState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get setState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get performTransaction(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

export default function NavigationContainer(props: Props) {
  const [state, setState] = React.useState<State>({
    navigationState: props.initialState,
  });

  const navigationState = React.useRef<
    NavigationState | PartialState | undefined | null
  >(null);

  const {
    performTransaction,
    getNavigationState,
    setNavigationState,
  }: {
    performTransaction: (action: () => void) => void;
    getNavigationState: () => PartialState | NavigationState | undefined;
    setNavigationState: (
      newNavigationState: NavigationState | undefined
    ) => void;
  } = React.useMemo(
    () => ({
      performTransaction: action => {
        setState((state: State) => {
          navigationState.current = state.navigationState;
          action();
          return { navigationState: navigationState.current };
        });
      },
      getNavigationState: () =>
        navigationState.current || state.navigationState,
      setNavigationState: newNavigationState => {
        if (navigationState.current === null) {
          throw new Error(
            'setState need to be wrapped in a performTransaction'
          );
        }
        navigationState.current = newNavigationState;
      },
    }),
    []
  );

  const isFirstMount = React.useRef<boolean>(true);
  React.useEffect(() => {
    navigationState.current = null;
    if (!isFirstMount.current && props.onStateChange) {
      props.onStateChange(state.navigationState);
    }
    isFirstMount.current = false;
  }, [state.navigationState, props.onStateChange]);

  return (
    <NavigationStateContext.Provider
      value={{
        state: state.navigationState,
        getState: getNavigationState,
        setState: setNavigationState,
        performTransaction: performTransaction,
      }}
    >
      <EnsureSingleNavigator>{props.children}</EnsureSingleNavigator>
    </NavigationStateContext.Provider>
  );
}
