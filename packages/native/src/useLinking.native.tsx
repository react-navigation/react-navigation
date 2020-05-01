import * as React from 'react';
import { Linking, Platform } from 'react-native';
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
    enabled = true,
    prefixes,
    config,
    getStateFromPath = getStateFromPathDefault,
  }: LinkingOptions
) {
  React.useEffect(() => {
    if (enabled !== false && isUsingLinking) {
      throw new Error(
        [
          'Looks like you have configured linking in multiple places. This is likely an error since deep links should only be handled in one place to avoid conflicts. Make sure that:',
          "- You are not using both 'linking' prop and 'useLinking'",
          "- You don't have 'useLinking' in multiple components",
          Platform.OS === 'android'
            ? "- You have set 'android:launchMode=singleTask' in the '<activity />' section of the 'AndroidManifest.xml' file to avoid launching multiple instances"
            : '',
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
  const prefixesRef = React.useRef(prefixes);
  const configRef = React.useRef(config);
  const getStateFromPathRef = React.useRef(getStateFromPath);

  React.useEffect(() => {
    enabledRef.current = enabled;
    prefixesRef.current = prefixes;
    configRef.current = config;
    getStateFromPathRef.current = getStateFromPath;
  }, [config, enabled, getStateFromPath, prefixes]);

  const extractPathFromURL = React.useCallback((url: string) => {
    for (const prefix of prefixesRef.current) {
      if (url.startsWith(prefix)) {
        return url.replace(prefix, '');
      }
    }

    return undefined;
  }, []);

  const getInitialState = React.useCallback(async () => {
    if (!enabledRef.current) {
      return undefined;
    }

    const url = await (Promise.race([
      Linking.getInitialURL(),
      new Promise((resolve) =>
        // Timeout in 150ms if `getInitialState` doesn't resolve
        // Workaround for https://github.com/facebook/react-native/issues/25675
        setTimeout(resolve, 150)
      ),
    ]) as Promise<string | null | undefined>);

    const path = url ? extractPathFromURL(url) : null;

    if (path) {
      return getStateFromPathRef.current(path, configRef.current);
    } else {
      return undefined;
    }
  }, [extractPathFromURL]);

  React.useEffect(() => {
    const listener = ({ url }: { url: string }) => {
      if (!enabled) {
        return;
      }

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
  }, [enabled, extractPathFromURL, ref]);

  return {
    getInitialState,
  };
}
