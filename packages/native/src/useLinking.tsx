import * as React from 'react';
import {
  getStateFromPath as getStateFromPathDefault,
  getPathFromState as getPathFromStateDefault,
  NavigationContainerRef,
  NavigationState,
  getActionFromState,
} from '@react-navigation/core';
import { LinkingOptions } from './types';

type ResultState = ReturnType<typeof getStateFromPathDefault>;

type HistoryState = { index: number };

declare const history: {
  state?: HistoryState;
  go(delta: number): void;
  pushState(state: HistoryState, title: string, url: string): void;
  replaceState(state: HistoryState, title: string, url: string): void;
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

  const getInitialState = React.useCallback(() => {
    let value: ResultState | undefined;

    if (enabledRef.current) {
      const path = location.pathname + location.search;

      if (path) {
        value = getStateFromPathRef.current(path, configRef.current);
      }
    }

    const then = (callback: (state: ResultState | undefined) => void) =>
      Promise.resolve(callback(value));

    // Make it a thenable to keep consistent with the native impl
    const thenable = {
      then,
      catch() {
        return thenable;
      },
    };

    return thenable;
  }, []);

  const previousStateLengthRef = React.useRef<number | undefined>(undefined);
  const previousHistoryIndexRef = React.useRef(0);

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

      const previousHistoryIndex = previousHistoryIndexRef.current;
      const historyIndex = history.state?.index ?? 0;

      previousHistoryIndexRef.current = historyIndex;

      if (pendingIndexChangeRef.current === historyIndex) {
        pendingIndexChangeRef.current = undefined;
        return;
      }

      const state = navigation.getRootState();
      const path = getPathFromStateRef.current(state, configRef.current);

      let canGoBack = true;
      let numberOfBacks = 0;

      if (previousHistoryIndex === historyIndex) {
        if (location.pathname + location.search !== path) {
          pendingStateUpdateRef.current = true;
          history.replaceState({ index: historyIndex }, '', path);
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

    if (ref.current && previousStateLengthRef.current === undefined) {
      previousStateLengthRef.current = getStateLength(
        ref.current.getRootState()
      );
    }

    if (ref.current && location.pathname + location.search === '/') {
      history.replaceState(
        { index: history.state?.index ?? 0 },
        '',
        getPathFromStateRef.current(
          ref.current.getRootState(),
          configRef.current
        )
      );
    }

    const unsubscribe = ref.current?.addListener('state', () => {
      const navigation = ref.current;

      if (!navigation) {
        return;
      }

      const state = navigation.getRootState();
      const path = getPathFromStateRef.current(state, configRef.current);

      const previousStateLength = previousStateLengthRef.current ?? 1;
      const stateLength = getStateLength(state);

      if (pendingStateMultiUpdateRef.current) {
        if (location.pathname + location.search === path) {
          pendingStateMultiUpdateRef.current = false;
        } else {
          return;
        }
      }

      previousStateLengthRef.current = stateLength;

      if (
        pendingStateUpdateRef.current &&
        location.pathname + location.search === path
      ) {
        pendingStateUpdateRef.current = false;
        return;
      }

      let index = history.state?.index ?? 0;

      if (previousStateLength === stateLength) {
        // If no new entries were added to history in our navigation state, we want to replaceState
        if (location.pathname + location.search !== path) {
          history.replaceState({ index }, '', path);
          previousHistoryIndexRef.current = index;
        }
      } else if (stateLength > previousStateLength) {
        // If new entries were added, pushState until we have same length
        // This won't be accurate if multiple entries were added at once, but that's the best we can do
        for (let i = 0, l = stateLength - previousStateLength; i < l; i++) {
          index++;
          history.pushState({ index }, '', path);
        }

        previousHistoryIndexRef.current = index;
      } else if (previousStateLength > stateLength) {
        const delta = Math.min(
          previousStateLength - stateLength,
          // We need to keep at least one item in the history
          // Otherwise we'll exit the page
          previousHistoryIndexRef.current - 1
        );

        if (delta > 0) {
          // We need to set this to ignore the `popstate` event
          pendingIndexChangeRef.current = index - delta;

          // If new entries were removed, go back so that we have same length
          history.go(-delta);
        } else {
          // We're not going back in history, but the navigation state changed
          // The URL probably also changed, so we need to re-sync the URL
          if (location.pathname + location.search !== path) {
            history.replaceState({ index }, '', path);
            previousHistoryIndexRef.current = index;
          }
        }
      }
    });

    return unsubscribe;
  });

  return {
    getInitialState,
  };
}
