import * as React from 'react';
import {
  getStateFromPath as getStateFromPathDefault,
  getPathFromState as getPathFromStateDefault,
  NavigationContainerRef,
  NavigationState,
  getActionFromState,
} from '@react-navigation/core';
import { nanoid } from 'nanoid/non-secure';
import ServerContext from './ServerContext';
import type { LinkingOptions } from './types';

type ResultState = ReturnType<typeof getStateFromPathDefault>;

type HistoryRecord = {
  // Unique identifier for this record to match it with window.history.state
  id: string;
  // Navigation state object for the history entry
  state: NavigationState;
  // Path of the history entry
  path: string;
};

const createMemoryHistory = () => {
  let index = 0;
  let items: HistoryRecord[] = [];

  // Whether there's a `history.go(n)` pending
  let pending = false;

  const history = {
    get index(): number {
      // We store an id in the state instead of an index
      // Index could get out of sync with in-memory values if page reloads
      const id = window.history.state?.id;

      if (id) {
        const index = items.findIndex((item) => item.id === id);

        return index > -1 ? index : 0;
      }

      return 0;
    },

    get(index: number) {
      return items[index];
    },

    backIndex({ path }: { path: string }) {
      // We need to find the index from the element before current to get closest path to go back to
      for (let i = index - 1; i >= 0; i--) {
        const item = items[i];

        if (item.path === path) {
          return i;
        }
      }

      return -1;
    },

    push({ path, state }: { path: string; state: NavigationState }) {
      const id = nanoid();

      // When a new entry is pushed, all the existing entries after index will be inaccessible
      // So we remove any existing entries after the current index to clean them up
      items = items.slice(0, index + 1);

      items.push({ path, state, id });
      index = items.length - 1;

      // We pass empty string for title because it's ignored in all browsers except safari
      // We don't store state object in history.state because:
      // - browsers have limits on how big it can be, and we don't control the size
      // - while not recommended, there could be non-serializable data in state
      window.history.pushState({ id }, '', path);
    },

    replace({ path, state }: { path: string; state: NavigationState }) {
      const id = window.history.state?.id ?? nanoid();

      if (items.length) {
        items[index] = { path, state, id };
      } else {
        // This is the first time any state modifications are done
        // So we need to push the entry as there's nothing to replace
        items.push({ path, state, id });
      }

      window.history.replaceState({ id }, '', path);
    },

    // `history.go(n)` is asynchronous, there are couple of things to keep in mind:
    // - it won't do anything if we can't go `n` steps, the `popstate` event won't fire.
    // - each `history.go(n)` call will trigger a separate `popstate` event with correct location.
    // - the `popstate` event fires before the next frame after calling `history.go(n)`.
    // This method differs from `history.go(n)` in the sense that it'll go back as many steps it can.
    go(n: number) {
      if (n > 0) {
        // We shouldn't go forward more than available index
        n = Math.min(n, items.length - 1);
      } else if (n < 0) {
        // We shouldn't go back more than the index
        // Otherwise we'll exit the page
        n = Math.max(n, -Math.max(index + 1, 1));
      }

      if (n === 0) {
        return;
      }

      index += n;

      return new Promise((resolve) => {
        pending = true;

        const done = () => {
          pending = false;

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

    // The `popstate` event is triggered when history changes, except `pushState` and `replaceState`
    // If we call `history.go(n)` ourselves, we don't want it to trigger the listener
    // Here we normalize it so that only external changes (e.g. user pressing back/forward) trigger the listener
    listen(listener: () => void) {
      const onPopState = () => {
        if (pending) {
          // This was triggered by `history.go(n)`, we shouldn't call the listener
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

/**
 * Find the matching navigation state that changed between 2 navigation states
 * e.g.: a -> b -> c -> d and a -> b -> c -> e -> f, if history in b changed, b is the matching state
 */
const findMatchingState = <T extends NavigationState>(
  a: T | undefined,
  b: T | undefined
): [T | undefined, T | undefined] => {
  if (a === undefined || b === undefined || a.key !== b.key) {
    return [undefined, undefined];
  }

  // Tab and drawer will have `history` property, but stack will have history in `routes`
  const aHistoryLength = a.history ? a.history.length : a.routes.length;
  const bHistoryLength = b.history ? b.history.length : b.routes.length;

  const aRoute = a.routes[a.index];
  const bRoute = b.routes[b.index];

  const aChildState = aRoute.state as T | undefined;
  const bChildState = bRoute.state as T | undefined;

  // Stop here if this is the state object that changed:
  // - history length is different
  // - focused routes are different
  // - one of them doesn't have child state
  // - child state keys are different
  if (
    aHistoryLength !== bHistoryLength ||
    aRoute.key !== bRoute.key ||
    aChildState === undefined ||
    bChildState === undefined ||
    aChildState.key !== bChildState.key
  ) {
    return [a, b];
  }

  return findMatchingState(aChildState, bChildState);
};

/**
 * Run async function in series as it's called.
 */
const series = (cb: () => Promise<void>) => {
  // Whether we're currently handling a callback
  let handling = false;
  let queue: (() => Promise<void>)[] = [];

  const callback = async () => {
    try {
      if (handling) {
        // If we're currently handling a previous event, wait before handling this one
        // Add the callback to the beginning of the queue
        queue.unshift(callback);
        return;
      }

      handling = true;

      await cb();
    } finally {
      handling = false;

      if (queue.length) {
        // If we have queued items, handle the last one
        const last = queue.pop();

        last?.();
      }
    }
  };

  return callback;
};

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

  const [history] = React.useState(createMemoryHistory);

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

  const previousIndexRef = React.useRef<number | undefined>(undefined);
  const previousStateRef = React.useRef<NavigationState | undefined>(undefined);
  const pendingPopStatePathRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    previousIndexRef.current = history.index;

    return history.listen(() => {
      const navigation = ref.current;

      if (!navigation || !enabled) {
        return;
      }

      const path = location.pathname + location.search;
      const index = history.index;

      const previousIndex = previousIndexRef.current ?? 0;

      previousIndexRef.current = index;
      pendingPopStatePathRef.current = path;

      // When browser back/forward is clicked, we first need to check if state object for this index exists
      // If it does we'll reset to that state object
      // Otherwise, we'll handle it like a regular deep link
      const record = history.get(index);

      if (record?.path === path && record?.state) {
        navigation.resetRoot(record.state);
        return;
      }

      const state = getStateFromPathRef.current(path, configRef.current);

      // We should only dispatch an action when going forward
      // Otherwise the action will likely add items to history, which would mess things up
      if (state && index > previousIndex) {
        const action = getActionFromState(state);

        if (action !== undefined) {
          navigation.dispatch(action);
        } else {
          navigation.resetRoot(state);
        }
      } else {
        // if current path didn't return any state, we should revert to initial state
        navigation.resetRoot(state);
      }
    });
  }, [enabled, history, ref]);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    if (ref.current) {
      // We need to record the current metadata on the first render if they aren't set
      // This will allow the initial state to be in the history entry
      const state = ref.current.getRootState();
      const path = getPathFromStateRef.current(state, configRef.current);

      if (previousStateRef.current === undefined) {
        previousStateRef.current = state;
      }

      history.replace({ path, state });
    }

    const onStateChange = async () => {
      const navigation = ref.current;

      if (!navigation || !enabled) {
        return;
      }

      const previousState = previousStateRef.current;
      const state = navigation.getRootState();

      const pendingPath = pendingPopStatePathRef.current;
      const path = getPathFromStateRef.current(state, configRef.current);

      previousStateRef.current = state;
      pendingPopStatePathRef.current = undefined;

      // To detect the kind of state change, we need to:
      // - Find the common focused navigation state in previous and current state
      // - If only the route keys changed, compare history/routes.length to check if we go back/forward/replace
      // - If no common focused navigation state found, it's a replace
      const [previousFocusedState, focusedState] = findMatchingState(
        previousState,
        state
      );

      if (
        previousFocusedState &&
        focusedState &&
        // We should only handle push/pop if path changed from what was in last `popstate`
        // Otherwise it's likely a change triggered by `popstate`
        path !== pendingPath
      ) {
        const historyDelta =
          (focusedState.history
            ? focusedState.history.length
            : focusedState.routes.length) -
          (previousFocusedState.history
            ? previousFocusedState.history.length
            : previousFocusedState.routes.length);

        if (historyDelta > 0) {
          // If history length is increased, we should pushState
          // Note that path might not actually change here, for example, drawer open should pushState
          history.push({ path, state });
        } else if (historyDelta < 0) {
          // If history length is decreased, i.e. entries were removed, we want to go back

          const nextIndex = history.backIndex({ path });
          const currentIndex = history.index;

          if (nextIndex !== -1 && nextIndex < currentIndex) {
            // An existing entry for this path exists and it's less than current index, go back to that
            await history.go(nextIndex - currentIndex);
          } else {
            // We couldn't find an existing entry to go back to, so we'll go back by the delta
            // This won't be correct if multiple routes were pushed in one go before
            // Usually this shouldn't happen and this is a fallback for that
            await history.go(historyDelta);
          }

          // Store the updated state as well as fix the path if incorrect
          history.replace({ path, state });
        } else {
          // If history length is unchanged, we want to replaceState
          history.replace({ path, state });
        }
      } else {
        // If no common navigation state was found, assume it's a replace
        // This would happen if the user did a reset/conditionally changed navigators
        history.replace({ path, state });
      }
    };

    // We debounce onStateChange coz we don't want multiple state changes to be handled at one time
    // This could happen since `history.go(n)` is asynchronous
    // If `pushState` or `replaceState` were called before `history.go(n)` completes, it'll mess stuff up
    return ref.current?.addListener('state', series(onStateChange));
  });

  return {
    getInitialState,
  };
}
