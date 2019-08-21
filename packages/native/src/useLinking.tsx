import * as React from 'react';
import { Linking } from 'react-native';
import {
  getStateFromPath as getStateFromPathDefault,
  NavigationContainerRef,
  NavigationState,
  PartialState,
} from '@react-navigation/core';

type Options = {
  /**
   * The prefixes are stripped from the URL before parsing them.
   * Usually they are the `scheme` + `host` (e.g. `myapp://chat?user=jane`)
   */
  prefixes: string[];
  /**
   * Custom function to parse the URL object to a valid navigation state.
   */
  getStateFromPath?: (
    path: string
  ) => PartialState<NavigationState> | undefined;
};

export default function useLinking(
  ref: React.RefObject<NavigationContainerRef>,
  { prefixes, getStateFromPath = getStateFromPathDefault }: Options
) {
  // We store these options in ref to avoid re-creating getInitialState and re-subscribing listeners
  // This lets user avoid wrapping the items in `React.useCallback` or `React.useMemo`
  // Not re-creating `getInitialState` is important coz it makes it easier for the user to use in an effect
  const prefixesRef = React.useRef(prefixes);
  const getStateFromPathRef = React.useRef(getStateFromPath);

  React.useEffect(() => {
    prefixesRef.current = prefixes;
    getStateFromPathRef.current = getStateFromPath;
  }, [getStateFromPath, prefixes]);

  const extractPathFromURL = React.useCallback((url: string) => {
    for (const prefix of prefixesRef.current) {
      if (url.startsWith(prefix)) {
        return url.replace(prefix, '');
      }
    }

    return undefined;
  }, []);

  const getInitialState = React.useCallback(async () => {
    const url = await Linking.getInitialURL();
    const path = url ? extractPathFromURL(url) : null;

    if (path) {
      return getStateFromPathRef.current(path);
    } else {
      return undefined;
    }
  }, [extractPathFromURL]);

  React.useEffect(() => {
    const listener = ({ url }: { url: string }) => {
      const path = extractPathFromURL(url);
      const navigation = ref.current;

      if (navigation && path) {
        const state = getStateFromPathRef.current(path);

        if (state) {
          navigation.resetRoot(state);
        }
      }
    };

    Linking.addEventListener('url', listener);

    return () => Linking.removeEventListener('url', listener);
  }, [extractPathFromURL, ref]);

  return {
    getInitialState,
  };
}
