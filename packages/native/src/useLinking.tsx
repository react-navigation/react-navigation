import * as React from 'react';
import {
  getStateFromPath as getStateFromPathDefault,
  getPathFromState as getPathFromStateDefault,
  NavigationContainerRef,
  NavigationState,
  Route,
  getActionFromState,
} from '@react-navigation/core';
import { nanoid } from 'nanoid/non-secure';
import ServerContext from './ServerContext';
import { LinkingOptions } from './types';

type ResultState = ReturnType<typeof getStateFromPathDefault>;

type HistoryRecord = {
  id: string;
  key: string;
  path: string;
  state: NavigationState;
};

const createMemoryHistory = () => {
  let index = 0;
  let items: HistoryRecord[] = [];

  const history = {
    get index(): number {
      // We store an id in the state instead of an index
      // Because index could get out of sync with in memory values if page reloads
      const id = window.history.state?.id;

      if (id) {
        const index = items.findIndex((item) => item.id === id);

        return index > -1 ? index : 0;
      }

      return 0;
    },

    get(index: number) {
      return items[index]?.state;
    },

    findIndex({ path, key }: { path: string; key: string }) {
      return items.findIndex((item) => item.path === path && item.key === key);
    },

    push({
      path,
      key,
      state,
    }: {
      path: string;
      key: string;
      state: NavigationState;
      times?: number;
    }) {
      const id = nanoid();

      items = items.slice(0, index + 1);

      items.push({ path, state, key, id });
      index = items.length - 1;

      window.history.pushState({ id }, '', path);
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
      const id = window.history.state?.id ?? nanoid();

      if (index === items.length - 1) {
        items[index] = { path, state, key, id };
      } else {
        items.push({ path, state, key, id });
      }

      if (items.length < index + 1) {
        items.length = index + 1;
      }

      window.history.replaceState({ id }, '', path);
    },

    /**
     * `history.go(n)` is asynchronous, there are couple of things to keep in mind:
     * - it won't do anything if we can't go `n` steps, the `popstate` event won't fire.
     * - each `history.go(n)` call will trigger a separate `popstate` event with correct location.
     * - the `popstate` event fires before the next frame after calling `history.go(n)`.
     */
    go(n: number) {
      if (n > 0) {
        // We shouldn't go forward more than available index
        n = Math.min(n, items.length - 1);
      } else if (n > 0) {
        // We shouldn't go back more than the index
        // Otherwise we'll exit the page
        n = Math.max(n, -Math.max(index + 1, 1));
      }

      if (n === 0) {
        return;
      }

      index += n;

      return new Promise((resolve) => {
        const done = () => {
          window.removeEventListener('popstate', done);
          resolve();
        };

        // Resolve the promise in the next frame
        // If `popstate` hasn't fired by then, then it wasn't handled
        requestAnimationFrame(() => requestAnimationFrame(done));

        window.addEventListener('popstate', done);
        window.history.go(n);
      });
    },

    listen(listener: () => void) {
      const onPopState = () => {
        if (index === history.index) {
          // We're at correct index, this was likely triggered by history.go(n)
          return;
        }

        listener();
      };

      window.addEventListener('popstate', onPopState);

      return () => window.removeEventListener('popstate', onPopState);
    },
  };

  return history;
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

      const recordedState = history.get(history.index);

      if (recordedState) {
        navigation.resetRoot(recordedState);
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

    // Whether we're currently handling an event
    let handling = false;

    // Whether we have a new event waiting
    // We only store a boolean instead of a queue because only the last one matters
    let waiting = false;

    const onStateChange = async () => {
      const navigation = ref.current;

      if (!navigation || !enabled) {
        return;
      }

      // If we're currently handling a previous event, wait before handling this one
      if (handling) {
        waiting = true;
      }

      handling = true;

      const state = navigation.getRootState();
      const path = getPathFromStateRef.current(state, configRef.current);
      const route = findFocusedRoute(state);

      const previousStateLength = previousStateLengthRef.current ?? 0;
      const stateLength = getStateLength(state);

      previousStateLengthRef.current = stateLength;

      const nextIndex = history.findIndex({ path, key: route.key });

      if (nextIndex !== -1) {
        // If new entries were removed, go back so that we have same length
        await history.go(nextIndex - history.index);
        return;
      }

      if (previousStateLength === stateLength) {
        // If no new entries were added to history in our navigation state, we want to replaceState
        history.replace({ path, key: route.key, state });
      } else if (stateLength > previousStateLength) {
        // If new entries were added, pushState
        history.push({ path, key: route.key, state });
      } else if (previousStateLength > stateLength) {
        // If new entries were removed, go back
        // Normally this should be handled with `findIndex`
        // Otherwise we don't really know how many steps to go back
        await history.go(-1);

        // Fix up the path if incorrect
        history.replace({ path, key: route.key, state });
      }

      handling = false;

      // If we were previously waiting, handle the event now
      if (waiting) {
        waiting = false;
        onStateChange();
      }
    };

    return ref.current?.addListener('state', onStateChange);
  });

  return {
    getInitialState,
  };
}
