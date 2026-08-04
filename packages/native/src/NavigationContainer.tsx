import {
  BaseNavigationContainer,
  getActionFromState,
  getPathFromState,
  getStateFromPath,
  type InitialState,
  type NavigationContainerProps,
  type NavigationContainerRef,
  type NavigationState,
  type PartialState,
  type RootParamList,
  ThemeProvider,
  validatePathConfig,
} from '@react-navigation/core';
import * as React from 'react';

import { DEFAULT_DIRECTION, IS_NATIVE } from './constants';
import { LinkingContext } from './LinkingContext';
import { LocaleDirContext } from './LocaleDirContext';
import { parse as parseState, stringify as stringifyState } from './serializer';
import { LightTheme } from './theming/LightTheme';
import type {
  DocumentTitleOptions,
  LinkingOptions,
  LocaleDirection,
  Persistor,
} from './types';
import { useBackButton } from './useBackButton';
import { useDocumentTitle } from './useDocumentTitle';
import { useLinking } from './useLinking';
import { type Thenable, useThenable } from './useThenable';

declare global {
  var REACT_NAVIGATION_DEVTOOLS: WeakMap<
    object,
    {
      readonly linking: LinkingOptions<any>;
      readonly listeners: Set<
        (data: {
          type: 'link';
          url: string;
          state: PartialState<NavigationState> | undefined;
        }) => void
      >;
    }
  >;
}

globalThis.REACT_NAVIGATION_DEVTOOLS = new WeakMap();

type Props<ParamList extends {}> = NavigationContainerProps & {
  /**
   * Initial state object for the navigation tree.
   *
   * If this is provided:
   * - Deep link or URLs won't be handled on the initial render.
   * - Persisted state won't be restored.
   */
  initialState?: NavigationContainerProps['initialState'];
  /**
   * Text direction of the components. Defaults to `'ltr'`.
   */
  direction?: LocaleDirection;
  /**
   * Options for deep linking.
   *
   * Deep link handling is enabled when this prop is provided,
   * unless `linking.enabled` is `false`.
   */
  linking?: LinkingOptions<ParamList>;
  /**
   * Persistor object to persist and restore navigation state.
   *
   * State is not restored if a deep link is handled on the initial render
   * Not supported on web when linking is enabled.
   *
   * Example:
   *
   * ```ts
   * const persistor = {
   *   async persist(state) {
   *     if (state !== undefined) {
   *       await AsyncStorage.setItem('state-key-v1', state);
   *     }
   *   },
   *   async restore() {
   *     const state = await AsyncStorage.getItem('state-key-v1');
   *
   *     return state ?? undefined;
   *   },
   * };
   *
   * <NavigationContainer persistor={persistor}>...</NavigationContainer>
   * ```
   */
  persistor?: Persistor;
  /**
   * Fallback element to render until initial state is resolved.
   * Used when deep link or persisted state is being restored asynchronously.
   *
   * Defaults to `null`.
   */
  fallback?: React.ReactElement | null;
  /**
   * Options to configure the document title on Web.
   *
   * Updating document title is handled by default,
   * unless `documentTitle.enabled` is `false`.
   */
  documentTitle?: DocumentTitleOptions;
  /**
   * Ref object which refers to the navigation object containing helper methods.
   */
  ref?: React.Ref<NavigationContainerRef<ParamList>> | undefined;
};

const RESTORE_STATE_ERROR =
  'Failed to restore navigation state. The state will be initialized based on the navigation tree.';

const PERSIST_STATE_ERROR = 'Failed to persist navigation state.';

const isPromiseLike = <T,>(
  value: T | PromiseLike<T>
): value is PromiseLike<T> =>
  value !== null &&
  (typeof value === 'object' || typeof value === 'function') &&
  'then' in value &&
  typeof value.then === 'function';

/**
 * Container component that manages the navigation state.
 *
 * This should be rendered at the root wrapping the whole app.
 */
export function NavigationContainer<ParamList extends {} = RootParamList>({
  direction = DEFAULT_DIRECTION,
  theme = LightTheme,
  linking,
  persistor,
  fallback = null,
  documentTitle,
  onStateChange,
  ref,
  ...rest
}: Props<ParamList>) {
  const refContainer = React.useRef<NavigationContainerRef<ParamList>>(null);

  useBackButton(refContainer);
  useDocumentTitle(refContainer, documentTitle);

  const linkingConfig = React.useMemo(() => {
    if (linking == null) {
      return {
        options: {
          enabled: false,
        },
      };
    }

    if (linking?.config) {
      validatePathConfig(linking.config);
    }

    return {
      options: {
        ...linking,
        enabled: linking.enabled !== false,
        prefixes: linking.prefixes ?? ['*'],
        getStateFromPath: linking?.getStateFromPath ?? getStateFromPath,
        getPathFromState: linking?.getPathFromState ?? getPathFromState,
        getActionFromState: linking?.getActionFromState ?? getActionFromState,
      },
    };
  }, [linking]);

  const { getInitialState } = useLinking(refContainer, linkingConfig.options);

  // Add additional linking related info to the ref
  // This will be used by the devtools
  React.useEffect(() => {
    if (refContainer.current) {
      const previous = REACT_NAVIGATION_DEVTOOLS.get(refContainer.current);
      const listeners = previous?.listeners ?? new Set();

      REACT_NAVIGATION_DEVTOOLS.set(refContainer.current, {
        get linking() {
          return linkingConfig.options;
        },
        get listeners() {
          return listeners;
        },
      });
    }
  });

  const [isLinkStateResolved, initialStateFromLink] = useThenable(() => {
    if (rest.initialState != null || !linkingConfig.options.enabled) {
      return undefined;
    }

    return getInitialState();
  });

  const isPersistenceSupported = IS_NATIVE || !linkingConfig.options.enabled;

  const [isPersistedStateResolved, initialStateFromPersisted] = useThenable(
    () => {
      if (
        isPersistenceSupported === false ||
        rest.initialState != null ||
        persistor == null
      ) {
        return undefined;
      }

      try {
        const restoredState = persistor.restore();

        if (isPromiseLike(restoredState)) {
          return Promise.resolve(restoredState)
            .then((state) =>
              parseState(
                state,
                linking?.config,
                persistor.parse?.bind(persistor)
              )
            )
            .catch((error) => {
              console.error(RESTORE_STATE_ERROR, error);

              return undefined;
            });
        }

        const parsedState = parseState(
          restoredState,
          linking?.config,
          persistor.parse?.bind(persistor)
        );

        const thenable: Thenable<InitialState | undefined> = {
          then(onfulfilled) {
            return Promise.resolve(
              onfulfilled ? onfulfilled(parsedState) : parsedState
            );
          },
        };

        return thenable;
      } catch (error) {
        console.error(RESTORE_STATE_ERROR, error);

        return undefined;
      }
    }
  );

  // FIXME
  // @ts-expect-error not sure why this is not working
  React.useImperativeHandle(ref, () => refContainer.current);

  const isStateReady =
    rest.initialState != null ||
    (isLinkStateResolved && isPersistedStateResolved);

  if (!isStateReady) {
    return (
      <LocaleDirContext.Provider value={direction}>
        <ThemeProvider value={theme}>{fallback}</ThemeProvider>
      </LocaleDirContext.Provider>
    );
  }

  return (
    <LocaleDirContext.Provider value={direction}>
      <LinkingContext.Provider value={linkingConfig}>
        <BaseNavigationContainer
          {...rest}
          theme={theme}
          initialState={
            rest.initialState ??
            initialStateFromLink ??
            initialStateFromPersisted
          }
          onStateChange={(state) => {
            onStateChange?.(state);

            if (persistor == null) {
              return;
            }

            try {
              const result = persistor.persist(
                stringifyState(
                  state,
                  linking?.config,
                  persistor.stringify?.bind(persistor)
                )
              );

              if (isPromiseLike(result)) {
                Promise.resolve(result).catch((error) => {
                  console.error(PERSIST_STATE_ERROR, error);
                });
              }
            } catch (error) {
              console.error(PERSIST_STATE_ERROR, error);
            }
          }}
          ref={refContainer}
        />
      </LinkingContext.Provider>
    </LocaleDirContext.Provider>
  );
}
