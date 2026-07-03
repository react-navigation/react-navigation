import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import * as React from 'react';
import useLatestCallback from 'use-latest-callback';

type Selector<ParamList extends ParamListBase, T> = (
  state: NavigationState<ParamList>
) => T;

/**
 * Hook to get a value from the current navigation state using a selector.
 *
 * @param selector Selector function to get a value from the state.
 */
export function useNavigationState<ParamList extends ParamListBase, T>(
  selector: Selector<ParamList, T>
): T {
  const stateListener = React.useContext(NavigationStateListenerContext);

  if (stateListener == null) {
    throw new Error(
      "Couldn't get the navigation state. Is your component inside a navigator?"
    );
  }

  const { getState, subscribe } = stateListener;

  const [, forceUpdate] = React.useReducer((count: number) => count + 1, 0);

  // Read the selected value during render so it's always up-to-date
  // This reads the latest committed (or pending) state via `getState`, so the
  // value is never stale and doesn't depend on effect timing to be correct
  const selected = selector(getState() as NavigationState<ParamList>);

  // Keep the latest selector and its result so the subscription can detect
  // whether a state change actually affects this component's selected value
  const selectionRef = React.useRef({ selector, selected });

  React.useLayoutEffect(() => {
    selectionRef.current = { selector, selected };
  });

  React.useEffect(() => {
    const checkForUpdates = () => {
      const selection = selectionRef.current;

      if (
        !Object.is(
          selection.selected,
          selection.selector(getState() as NavigationState<ParamList>)
        )
      ) {
        // Schedule a re-render only when the selected value has changed
        // This runs in a passive/layout effect (never during an insertion
        // effect), so it's safe to schedule updates here
        forceUpdate();
      }
    };

    const unsubscribe = subscribe(checkForUpdates);

    // The state may have changed between the render and the subscription
    checkForUpdates();

    return unsubscribe;
  }, [getState, subscribe]);

  return selected;
}

export function NavigationStateListenerProvider({
  state,
  getState,
  children,
}: {
  state: NavigationState<ParamListBase>;
  getState: () => NavigationState<ParamListBase>;
  children: React.ReactNode;
}) {
  const listeners = React.useRef<(() => void)[]>([]);

  const subscribe = useLatestCallback((callback: () => void) => {
    listeners.current.push(callback);

    return () => {
      listeners.current = listeners.current.filter((cb) => cb !== callback);
    };
  });

  // Notify subscribers once the new state has committed
  // This runs in a layout effect (not an insertion effect) because notifying
  // subscribers schedules state updates in the consumers, which React forbids
  // inside insertion effects (`useInsertionEffect must not schedule updates`).
  // Consumers still read the up-to-date value during render via `getState`, so
  // moving the notification to the layout phase doesn't cause stale reads.
  React.useLayoutEffect(() => {
    listeners.current.forEach((callback) => callback());
  }, [state]);

  const context = React.useMemo(
    () => ({
      getState,
      subscribe,
    }),
    [getState, subscribe]
  );

  return (
    <NavigationStateListenerContext.Provider value={context}>
      {children}
    </NavigationStateListenerContext.Provider>
  );
}

const NavigationStateListenerContext = React.createContext<
  | {
      getState: () => NavigationState<ParamListBase>;
      subscribe: (callback: () => void) => () => void;
    }
  | undefined
>(undefined);
