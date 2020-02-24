import * as React from 'react';
import { Linking } from 'react-native';
import {
  getActionFromState,
  getStateFromPath as getStateFromPathDefault,
  NavigationContainerRef,
} from '@react-navigation/core';
import { LinkingOptions } from './types';

let isUsingLinking = false;

export default function useLinking(
  ref: React.RefObject<NavigationContainerRef>,
  {
    prefixes,
    config,
    getStateFromPath = getStateFromPathDefault,
  }: LinkingOptions
) {
  React.useEffect(() => {
    if (isUsingLinking) {
      throw new Error(
        "Looks like you are using 'useLinking' in multiple components. This is likely an error since deep links should only be handled in one place to avoid conflicts."
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
  const prefixesRef = React.useRef(prefixes);
  const configRef = React.useRef(config);
  const getStateFromPathRef = React.useRef(getStateFromPath);

  React.useEffect(() => {
    prefixesRef.current = prefixes;
    configRef.current = config;
    getStateFromPathRef.current = getStateFromPath;
  }, [config, getStateFromPath, prefixes]);

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
      return getStateFromPathRef.current(path, configRef.current);
    } else {
      return undefined;
    }
  }, [extractPathFromURL]);

  React.useEffect(() => {
    const listener = ({ url }: { url: string }) => {
      const path = extractPathFromURL(url);
      const navigation = ref.current;

      if (navigation && path) {
        const state = getStateFromPathRef.current(path, configRef.current);

        if (state) {
          const action = getActionFromState(state);

          if (action !== undefined) {
            navigation.dispatch(action);
          } else {
            navigation.resetRoot(state);
          }
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
