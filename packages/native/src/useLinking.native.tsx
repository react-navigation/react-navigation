import {
  getActionFromState as getActionFromStateDefault,
  getStateFromPath as getStateFromPathDefault,
  type NavigationContainerRef,
  type ParamListBase,
  useNavigationIndependentTree,
} from '@react-navigation/core';
import * as React from 'react';
import { Linking, Platform } from 'react-native';

import { getStateFromHref } from './getStateFromHref';
import type { LinkingOptions } from './types';
import type { Thenable } from './useThenable';

type ResultState = ReturnType<typeof getStateFromPathDefault>;

type Options = LinkingOptions<ParamListBase>;

const linkingHandlers = new Set<symbol>();

export function useLinking(
  ref: React.RefObject<NavigationContainerRef<ParamListBase> | null>,
  {
    enabled = true,
    prefixes = ['*'],
    filter,
    config,
    getInitialURL = () =>
      Promise.race([
        Linking.getInitialURL(),
        new Promise<undefined>((resolve) => {
          // Timeout in 150ms if `getInitialState` doesn't resolve
          // Workaround for https://github.com/facebook/react-native/issues/25675
          setTimeout(resolve, 150);
        }),
      ]),
    subscribe = (listener) => {
      const callback = ({ url }: { url: string }) => listener(url);

      const subscription = Linking.addEventListener('url', callback);

      return () => {
        subscription.remove();
      };
    },
    getStateFromPath = getStateFromPathDefault,
    getActionFromState = getActionFromStateDefault,
  }: Options
) {
  const independent = useNavigationIndependentTree();

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return undefined;
    }

    if (independent) {
      return undefined;
    }

    if (enabled !== false && linkingHandlers.size) {
      console.error(
        [
          'Looks like you have configured linking in multiple places. This is likely an error since deep links should only be handled in one place to avoid conflicts. Make sure that:',
          "- You don't have multiple NavigationContainers in the app each with 'linking' enabled",
          '- Only a single instance of the root component is rendered',
          Platform.OS === 'android'
            ? "- You have set 'android:launchMode=singleTask' in the '<activity />' section of the 'AndroidManifest.xml' file to avoid launching multiple instances"
            : '',
        ]
          .join('\n')
          .trim()
      );
    }

    const handler = Symbol();

    if (enabled !== false) {
      linkingHandlers.add(handler);
    }

    return () => {
      linkingHandlers.delete(handler);
    };
  }, [enabled, independent]);

  // We store these options in ref to avoid re-creating getInitialState and re-subscribing listeners
  // This lets user avoid wrapping the items in `React.useCallback` or `React.useMemo`
  // Not re-creating `getInitialState` is important coz it makes it easier for the user to use in an effect
  const enabledRef = React.useRef(enabled);
  const prefixesRef = React.useRef(prefixes);
  const filterRef = React.useRef(filter);
  const configRef = React.useRef(config);
  const getInitialURLRef = React.useRef(getInitialURL);
  const getStateFromPathRef = React.useRef(getStateFromPath);
  const getActionFromStateRef = React.useRef(getActionFromState);

  React.useEffect(() => {
    enabledRef.current = enabled;
    prefixesRef.current = prefixes;
    filterRef.current = filter;
    configRef.current = config;
    getInitialURLRef.current = getInitialURL;
    getStateFromPathRef.current = getStateFromPath;
    getActionFromStateRef.current = getActionFromState;
  });

  const getStateFromURL = React.useCallback(
    (url: string | null | undefined) => {
      if (!url) {
        return undefined;
      }

      try {
        return getStateFromHref(url, {
          prefixes: prefixesRef.current,
          filter: filterRef.current,
          config: configRef.current,
          getStateFromPath: getStateFromPathRef.current,
        });
      } catch (e) {
        return undefined;
      }
    },
    []
  );

  const getInitialState = React.useCallback(() => {
    let state: ResultState | undefined;

    if (enabledRef.current) {
      const url = getInitialURLRef.current();

      if (url != null) {
        if (typeof url !== 'string') {
          return url.then((url) => {
            const state = getStateFromURL(url);

            return state;
          });
        }
      }

      state = getStateFromURL(url);
    }

    const thenable: Thenable<ResultState | undefined> = {
      then(onfulfilled?: (state: ResultState | undefined) => void) {
        return Promise.resolve(onfulfilled ? onfulfilled(state) : state);
      },
    };

    return thenable;
  }, [getStateFromURL]);

  React.useEffect(() => {
    const listener = (url: string) => {
      if (!enabled) {
        return;
      }

      const navigation = ref.current;
      const state = navigation ? getStateFromURL(url) : undefined;

      if (navigation && state) {
        const action = getActionFromStateRef.current(state, configRef.current);

        if (action !== undefined) {
          try {
            navigation.dispatch(action);
          } catch (e) {
            // Ignore any errors from deep linking.
            // This could happen in case of malformed links, navigation object not being initialized etc.
            console.warn(
              `An error occurred when trying to handle the link '${url}': ${
                typeof e === 'object' && e != null && 'message' in e
                  ? e.message
                  : e
              }`
            );
          }
        } else {
          navigation.resetRoot(state);
        }
      }
    };

    return subscribe(listener);
  }, [enabled, getStateFromURL, prefixes, ref, subscribe]);

  return {
    getInitialState,
  };
}
