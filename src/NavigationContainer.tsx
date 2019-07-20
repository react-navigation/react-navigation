import * as React from 'react';
import EnsureSingleNavigator from './EnsureSingleNavigator';
import { NavigationState, PartialState } from './types';

type Props = {
  initialState?: PartialState;
  onStateChange?: (state: NavigationState | PartialState | undefined) => void;
  children: React.ReactNode;
};

type State = NavigationState | PartialState | undefined;

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
  const { onStateChange } = props;
  const [state, setState] = React.useState<State>(props.initialState);

  const navigationStateRef = React.useRef<State | null>(null);
  const isTransactionActiveRef = React.useRef<boolean>(false);
  const isFirstMountRef = React.useRef<boolean>(true);

  const context = React.useMemo(
    () => ({
      state,

      performTransaction: (callback: () => void) => {
        if (isTransactionActiveRef.current) {
          throw new Error(
            "Only one transaction can be active at a time. Did you accidentally nest 'performTransaction'?"
          );
        }

        setState((navigationState: State) => {
          isTransactionActiveRef.current = true;
          navigationStateRef.current = navigationState;

          callback();

          isTransactionActiveRef.current = false;

          return navigationStateRef.current;
        });
      },

      getState: () =>
        navigationStateRef.current !== null
          ? navigationStateRef.current
          : state,

      setState: (navigationState: State) => {
        if (navigationStateRef.current === null) {
          throw new Error(
            "Any 'setState' calls need to be done inside 'performTransaction'"
          );
        }

        navigationStateRef.current = navigationState;
      },
    }),
    [state]
  );

  React.useEffect(() => {
    navigationStateRef.current = null;

    if (!isFirstMountRef.current && onStateChange) {
      onStateChange(state);
    }

    isFirstMountRef.current = false;
  }, [state, onStateChange]);

  return (
    <NavigationStateContext.Provider value={context}>
      <EnsureSingleNavigator>{props.children}</EnsureSingleNavigator>
    </NavigationStateContext.Provider>
  );
}
