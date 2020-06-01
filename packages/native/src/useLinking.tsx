import * as React from 'react';
import {
  getStateFromPath as getStateFromPathDefault,
  getPathFromState as getPathFromStateDefault,
  NavigationContainerRef,
  NavigationState,
  Route,
  getActionFromState,
} from '@react-navigation/core';
import ServerContext from './ServerContext';
import { LinkingOptions } from './types';

type ResultState = ReturnType<typeof getStateFromPathDefault>;

type HistoryRecord = {
  key: string;
  path: string;
  state: NavigationState;
};

const createMemoryHistory = () => {
  let index = 0;

  const items: HistoryRecord[] = [];

  return {
    get latest() {
      return index;
    },

    get index(): number {
      return window.history.state?.index ?? 0;
    },

    has(index: number) {
      return items[index] !== undefined;
    },

    get(index: number) {
      return items[index].state;
    },

    push(path: string, key: string, state: NavigationState) {
      items.splice(index + 1);
      items.push({ path, state, key });
      index = items.length - 1;

      window.history.pushState({ index }, '', path);
    },

    replace(path: string, key: string, state: NavigationState) {
      items[index] = { path, state, key };
      window.history.replaceState({ index }, '', path);
    },

    back(n: number) {
      index -= n;
      window.history.go(-n);
    },

    go(path: string, key: string) {
      const nextIndex = items.findIndex(
        (item) => item.path === path && item.key === key
      );

      if (nextIndex === -1) {
        return false;
      }

      const delta = nextIndex - (window.history.state?.index ?? 0);

      if (delta === 0) {
        return true;
      }

      index = nextIndex;

      window.history.go(delta);

      return true;
    },
  };
};

const findFocusedRoute = (state: NavigationState): Route<string> => {
  const route = state.routes[state.index];

  if (route.state !== undefined) {
    return findFocusedRoute(route.state as NavigationState);
  }

  return route;
};

const getStateLength = (state: NavigationState) => {
  let length = 0;

  if (state.history) {
    length = state.history.length;
  } else {
    length = state.index + 1;
  }

  const focusedState = state.routes[state.index].state;

  if (focusedState && !focusedState.stale) {
    // If the focused route has history entries, we need to count them as well
    length += getStateLength(focusedState as NavigationState) - 1;
  }

  return length;
};

const history = createMemoryHistory();

let isUsingLinking = false;

export default function useLinking(
  ref: React.RefObject<NavigationContainerRef>,
  {
    enabled = true,
    config,
    getStateFromPath = getStateFromPathDefault,
    getPathFromState = getPathFromStateDefault,
  }: LinkingOptions
) {
  React.useEffect(() => {
    if (enabled !== false && isUsingLinking) {
      throw new Error(
        [
          'Looks like you have configured linking in multiple places. This is likely an error since URL integration should only be handled in one place to avoid conflicts. Make sure that:',
          "- You are not using both 'linking' prop and 'useLinking'",
          "- You don't have 'useLinking' in multiple components",
        ]
          .join('\n')
          .trim()
      );
    } else {
      isUsingLinking = enabled !== false;
    }

    return () => {
      isUsingLinking = false;
    };
  });

  // We store these options in ref to avoid re-creating getInitialState and re-subscribing listeners
  // This lets user avoid wrapping the items in `React.useCallback` or `React.useMemo`
  // Not re-creating `getInitialState` is important coz it makes it easier for the user to use in an effect
  const enabledRef = React.useRef(enabled);
  const configRef = React.useRef(config);
  const getStateFromPathRef = React.useRef(getStateFromPath);
  const getPathFromStateRef = React.useRef(getPathFromState);

  React.useEffect(() => {
    enabledRef.current = enabled;
    configRef.current = config;
    getStateFromPathRef.current = getStateFromPath;
    getPathFromStateRef.current = getPathFromState;
  }, [config, enabled, getPathFromState, getStateFromPath]);

  const server = React.useContext(ServerContext);

  const getInitialState = React.useCallback(() => {
    let value: ResultState | undefined;

    if (enabledRef.current) {
      const location =
        server?.location ??
        (typeof window !== 'undefined' ? window.location : undefined);

      const path = location ? location.pathname + location.search : undefined;

      if (path) {
        value = getStateFromPathRef.current(path, configRef.current);
      }
    }

    // Make it a thenable to keep consistent with the native impl
    const thenable = {
      then(onfulfilled?: (state: ResultState | undefined) => void) {
        return Promise.resolve(onfulfilled ? onfulfilled(value) : value);
      },
      catch() {
        return thenable;
      },
    };

    return thenable as PromiseLike<ResultState | undefined>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previousStateLengthRef = React.useRef<number | undefined>(undefined);

  const pendingIndexChangeRef = React.useRef<number | undefined>();
  const pendingStateUpdateRef = React.useRef<boolean>(false);
  const pendingStateMultiUpdateRef = React.useRef<boolean>(false);

  // If we're navigating ahead >1, we're not restoring whole state,
  // but just navigate to the selected route not caring about previous routes
  // therefore if we need to go back, we need to pop screen and navigate to the new one
  // Possibly, we will need to reuse the same mechanism.
  // E.g. if we went ahead+4 (numberOfIndicesAhead = 3), and back-2,
  // actually we need to pop the screen we navigated
  // and navigate again, setting numberOfIndicesAhead to 1.
  const numberOfIndicesAhead = React.useRef(0);

  React.useEffect(() => {
    const onPopState = () => {
      const navigation = ref.current;

      if (!navigation || !enabled) {
        return;
      }

      const previousHistoryIndex = history.latest;
      const historyIndex = history.index;

      if (pendingIndexChangeRef.current === historyIndex) {
        pendingIndexChangeRef.current = undefined;
        return;
      }

      if (history.has(historyIndex)) {
        pendingStateUpdateRef.current = true;
        navigation.resetRoot(history.get(historyIndex));
        return;
      }

      const state = navigation.getRootState();
      const path = getPathFromStateRef.current(state, configRef.current);
      const route = findFocusedRoute(state);

      let canGoBack = true;
      let numberOfBacks = 0;

      if (previousHistoryIndex === historyIndex) {
        if (location.pathname + location.search !== path) {
          history.replace(path, route.key, state);
        }
      } else if (previousHistoryIndex > historyIndex) {
        numberOfBacks =
          previousHistoryIndex - historyIndex - numberOfIndicesAhead.current;

        if (numberOfBacks > 0) {
          pendingStateMultiUpdateRef.current = true;

          if (numberOfBacks > 1) {
            pendingStateMultiUpdateRef.current = true;
          }

          pendingStateUpdateRef.current = true;

          for (let i = 0; i < numberOfBacks; i++) {
            navigation.goBack();
          }
        } else {
          canGoBack = false;
        }
      }

      if (previousHistoryIndex < historyIndex || !canGoBack) {
        if (canGoBack) {
          numberOfIndicesAhead.current =
            historyIndex - previousHistoryIndex - 1;
        } else {
          navigation.goBack();
          numberOfIndicesAhead.current -= previousHistoryIndex - historyIndex;
        }

        const state = getStateFromPathRef.current(
          location.pathname + location.search,
          configRef.current
        );

        pendingStateMultiUpdateRef.current = true;

        if (state) {
          const action = getActionFromState(state);

          pendingStateUpdateRef.current = true;

          if (action !== undefined) {
            navigation.dispatch(action);
          } else {
            navigation.resetRoot(state);
          }
        }
      }
    };

    window.addEventListener('popstate', onPopState);

    return () => window.removeEventListener('popstate', onPopState);
  }, [enabled, ref]);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    if (ref.current) {
      const state = ref.current.getRootState();
      const path = getPathFromStateRef.current(state, configRef.current);
      const route = findFocusedRoute(state);

      if (previousStateLengthRef.current === undefined) {
        previousStateLengthRef.current = getStateLength(state);
      }

      history.replace(path, route.key, state);
    }

    const unsubscribe = ref.current?.addListener('state', () => {
      const navigation = ref.current;
      const previousStateLength = previousStateLengthRef.current ?? 0;

      if (!navigation) {
        return;
      }

      const state = navigation.getRootState();
      const path = getPathFromStateRef.current(state, configRef.current);
      const route = findFocusedRoute(state);

      if (pendingStateMultiUpdateRef.current) {
        if (location.pathname + location.search === path) {
          pendingStateMultiUpdateRef.current = false;
        } else {
          return;
        }
      }

      const stateLength = getStateLength(state);

      previousStateLengthRef.current = stateLength;

      const handled = history.go(path, route.key);

      if (handled) {
        return;
      }

      if (previousStateLength === stateLength) {
        // If no new entries were added to history in our navigation state, we want to replaceState
        history.replace(path, route.key, state);
      } else if (stateLength > previousStateLength) {
        // If new entries were added, pushState until we have same length
        // This won't be accurate if multiple entries were added at once, but that's the best we can do
        for (let i = 0, l = stateLength - previousStateLength; i < l; i++) {
          history.push(path, route.key, state);
        }
      } else if (previousStateLength > stateLength) {
        const delta = Math.min(
          previousStateLength - stateLength,
          // We need to keep at least one item in the history
          // Otherwise we'll exit the page
          history.latest - 1
        );

        if (delta > 0) {
          // We need to set this to ignore the `popstate` event
          pendingIndexChangeRef.current = history.index - delta;

          // If new entries were removed, go back so that we have same length
          history.back(delta);
        } else {
          // We're not going back in history, but the navigation state changed
          // The URL probably also changed, so we need to re-sync the URL and state
          history.replace(path, route.key, state);
        }
      }
    });

    return unsubscribe;
  });

  return {
    getInitialState,
  };
}
