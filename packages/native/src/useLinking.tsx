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
  let items: HistoryRecord[] = [];

  return {
    get index(): number {
      return window.history.state?.index ?? 0;
    },

    has(index: number) {
      return items[index] !== undefined;
    },

    get(index: number) {
      return items[index].state;
    },

    find({ path, key }: { path: string; key: string }) {
      return items.findIndex((item) => item.path === path && item.key === key);
    },

    push({
      path,
      key,
      state,
      times = 1,
    }: {
      path: string;
      key: string;
      state: NavigationState;
      times?: number;
    }) {
      items = items.slice(0, index + 1);

      items.push({ path, state, key });
      index = items.length - 1;

      window.history.pushState(
        { index, times, previous: window.history.state },
        '',
        path
      );
    },

    replace({
      path,
      key,
      state,
    }: {
      path: string;
      key: string;
      state: NavigationState;
    }) {
      if (index === items.length - 1) {
        items[index] = { path, state, key };
      } else {
        items.push({ path, state, key });
      }

      if (items.length < index + 1) {
        items.length = index + 1;
      }

      window.history.replaceState({ ...window.history.state, index }, '', path);
    },

    /**
     * `history.go(n)` is asynchronous, there are couple of things to keep in mind:
     * - it won't do anything if we can't go `n` steps, the `popstate` event won't fire.
     * - each `history.go(n)` call will trigger a separate `popstate` event with correct location.
     * - the `popstate` event fires before the next frame after calling `history.go(n)`.
     */
    go(n: number) {
      let delta = n;

      if (n < 0) {
        const times = window.history.state?.times ?? 1;

        delta += times - 1;

        if (-n > times) {
          let previous = window.history.state?.previous;

          while (previous) {
            delta += (previous.times ?? 1) - 1;
            previous = previous.previous;
          }
        }

        // We shouldn't go back more than the index
        // Otherwise we'll exit the page
        delta = Math.max(delta, -Math.max(index + 1, 1));
      }

      if (delta === 0) {
        return;
      }

      index += delta;

      return new Promise((resolve) => {
        const done = () => {
          window.removeEventListener('popstate', done);
          resolve();
        };

        // Resolve the promise in the next frame
        // If `popstate` hasn't fired by then, then it wasn't handled
        requestAnimationFrame(() => requestAnimationFrame(done));

        window.addEventListener('popstate', done);
        window.history.go(delta);
      });
    },

    listen(listener: () => void) {
      const onPopState = () => {
        if (index === window.history.state?.index) {
          // We're at correct index, this was likely triggered by history.go(n)
          return;
        }

        listener();
      };

      window.addEventListener('popstate', onPopState);

      return () => window.removeEventListener('popstate', onPopState);
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

  React.useEffect(() => {
    return history.listen(() => {
      const navigation = ref.current;

      if (!navigation || !enabled) {
        return;
      }

      if (history.has(history.index)) {
        navigation.resetRoot(history.get(history.index));
        return;
      }

      const state = getStateFromPathRef.current(
        location.pathname + location.search,
        configRef.current
      );

      if (state) {
        const action = getActionFromState(state);

        if (action !== undefined) {
          navigation.dispatch(action);
        } else {
          navigation.resetRoot(state);
        }
      }
    });
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

      history.replace({ path, key: route.key, state });
    }

    const unsubscribe = ref.current?.addListener('state', () => {
      const navigation = ref.current;

      if (!navigation) {
        return;
      }

      const state = navigation.getRootState();
      const path = getPathFromStateRef.current(state, configRef.current);
      const route = findFocusedRoute(state);

      const previousStateLength = previousStateLengthRef.current ?? 0;
      const stateLength = getStateLength(state);

      previousStateLengthRef.current = stateLength;

      const nextIndex = history.find({ path, key: route.key });

      if (nextIndex !== -1) {
        // If new entries were removed, go back so that we have same length
        history.go(nextIndex - history.index);
        return;
      }

      if (previousStateLength === stateLength) {
        // If no new entries were added to history in our navigation state, we want to replaceState
        history.replace({ path, key: route.key, state });
      } else if (stateLength > previousStateLength) {
        // If new entries were added, pushState until we have same length
        // This won't be accurate if multiple entries were added at once, but that's the best we can do
        history.push({
          path,
          key: route.key,
          state,
          times: stateLength - previousStateLength,
        });
      } else if (previousStateLength > stateLength) {
        // If new entries were removed, go back so that we have same length
        history.go(stateLength - previousStateLength);
      }
    });

    return unsubscribe;
  });

  return {
    getInitialState,
  };
}
