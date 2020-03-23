import * as React from 'react';
import {
  getStateFromPath as getStateFromPathDefault,
  getPathFromState as getPathFromStateDefault,
  NavigationContainerRef,
  NavigationState,
  getActionFromState,
} from '@react-navigation/core';
import { LinkingOptions } from './types';

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
    config,
    getStateFromPath = getStateFromPathDefault,
    getPathFromState = getPathFromStateDefault,
  }: LinkingOptions
) {
  React.useEffect(() => {
    if (isUsingLinking) {
      throw new Error(
        "Looks like you are using 'useLinking' in multiple components. This is likely an error since URL integration should only be handled in one place to avoid conflicts."
      );
    } else {
      isUsingLinking = true;
    }

    return () => {
      isUsingLinking = false;
    };
  });

  // We store these options in ref to avoid re-creating getInitialState and re-subscribing listeners
  // This lets user avoid wrapping the items in `React.useCallback` or `React.useMemo`
  // Not re-creating `getInitialState` is important coz it makes it easier for the user to use in an effect
  const configRef = React.useRef(config);
  const getStateFromPathRef = React.useRef(getStateFromPath);
  const getPathFromStateRef = React.useRef(getPathFromState);

  React.useEffect(() => {
    configRef.current = config;
    getStateFromPathRef.current = getStateFromPath;
    getPathFromStateRef.current = getPathFromState;
  }, [config, getPathFromState, getStateFromPath]);

  // Make it an async function to keep consistent with the native impl
  const getInitialState = React.useCallback(async () => {
    const path = location.pathname + location.search;

    if (path) {
      return getStateFromPathRef.current(path, configRef.current);
    } else {
      return undefined;
    }
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
    window.addEventListener('popstate', () => {
      const navigation = ref.current;

      if (!navigation) {
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
    });
  }, [ref]);

  React.useEffect(() => {
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
        // If no new enrties were added to history in our navigation state, we want to replaceState
        if (location.pathname + location.search !== path) {
          history.replaceState({ index }, '', path);
          previousHistoryIndexRef.current = index;
        }
      } else if (stateLength > previousStateLength) {
        // If new enrties were added, pushState until we have same length
        // This won't be accurate if multiple enrties were added at once, but that's the best we can do
        for (let i = 0, l = stateLength - previousStateLength; i < l; i++) {
          index++;
          history.pushState({ index }, '', path);
        }

        previousHistoryIndexRef.current = index;
      } else if (previousStateLength > stateLength) {
        const delta = previousStateLength - stateLength;

        // We need to set this to ignore the `popstate` event
        pendingIndexChangeRef.current = index - delta;

        // If new enrties were removed, go back so that we have same length
        history.go(-delta);
      }
    });

    return unsubscribe;
  });

  return {
    getInitialState,
  };
}
