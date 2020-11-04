import * as React from 'react';
import { Linking, Platform } from 'react-native';
import {
  getActionFromState,
  getStateFromPath as getStateFromPathDefault,
  NavigationContainerRef,
} from '@react-navigation/core';
import type { LinkingOptions } from './types';
import escapeStringRegexp from 'escape-string-regexp';

let isUsingLinking = false;

export default function useLinking(
  ref: React.RefObject<NavigationContainerRef>,
  {
    enabled = true,
    prefixes,
    config,
    getInitialURL = () =>
      Promise.race([
        Linking.getInitialURL(),
        new Promise<undefined>((resolve) =>
          // Timeout in 150ms if `getInitialState` doesn't resolve
          // Workaround for https://github.com/facebook/react-native/issues/25675
          setTimeout(resolve, 150)
        ),
      ]),
    subscribe = (listener) => {
      const callback = ({ url }: { url: string }) => listener(url);

      Linking.addEventListener('url', callback);

      return () => Linking.removeEventListener('url', callback);
    },
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
  const getInitialURLRef = React.useRef(getInitialURL);
  const getStateFromPathRef = React.useRef(getStateFromPath);

  React.useEffect(() => {
    enabledRef.current = enabled;
    prefixesRef.current = prefixes;
    configRef.current = config;
    getInitialURLRef.current = getInitialURL;
    getStateFromPathRef.current = getStateFromPath;
  }, [config, enabled, prefixes, getInitialURL, getStateFromPath]);

  const extractPathFromURL = React.useCallback((url: string) => {
    for (const prefix of prefixesRef.current) {
      const protocol = prefix.match(/^[^:]+:\/\//)?.[0] ?? '';
      const host = prefix.replace(protocol, '');
      const prefixRegex = new RegExp(
        `^${escapeStringRegexp(protocol)}${host
          .split('.')
          .map((it) => (it === '*' ? '[^/]+' : escapeStringRegexp(it)))
          .join('\\.')}`
      );
      if (prefixRegex.test(url)) {
        return url.replace(prefixRegex, '');
      }
    }

    return undefined;
  }, []);

  const getInitialState = React.useCallback(async () => {
    if (!enabledRef.current) {
      return undefined;
    }

    const url = await getInitialURLRef.current();
    const path = url ? extractPathFromURL(url) : null;

    if (path) {
      return getStateFromPathRef.current(path, configRef.current);
    } else {
      return undefined;
    }
  }, [extractPathFromURL]);

  React.useEffect(() => {
    const listener = (url: string) => {
      if (!enabled) {
        return;
      }

      const path = extractPathFromURL(url);
      const navigation = ref.current;

      if (navigation && path) {
        const state = getStateFromPathRef.current(path, configRef.current);

        if (state) {
          // Make sure that the routes in the state exist in the root navigator
          // Otherwise there's an error in the linking configuration
          const rootState = navigation.getRootState();

          if (
            state.routes.some((r) => !rootState?.routeNames.includes(r.name))
          ) {
            console.warn(
              "The navigation state parsed from the URL contains routes not present in the root navigator. This usually means that the linking configuration doesn't match the navigation structure. See https://reactnavigation.org/docs/configuring-links for more details on how to specify a linking configuration."
            );
            return;
          }

          const action = getActionFromState(state, configRef.current);

          if (action !== undefined) {
            try {
              navigation.dispatch(action);
            } catch (e) {
              // Ignore any errors from deep linking.
              // This could happen in case of malformed links, navigation object not being initialized etc.
              console.warn(
                `An error occurred when trying to handle the link '${path}': ${e.message}`
              );
            }
          } else {
            navigation.resetRoot(state);
          }
        }
      }
    };

    return subscribe(listener);
  }, [enabled, ref, subscribe, extractPathFromURL]);

  return {
    getInitialState,
  };
}
