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
import warnOnce from 'warn-once';

import { checkSerializable } from './checkSerializable';
import { DEFAULT_DIRECTION, IS_NATIVE } from './constants';
import { getStateBreadcrumb } from './getStateBreadcrumb';
import { LinkingContext } from './LinkingContext';
import { LocaleDirContext } from './LocaleDirContext';
import { serializer } from './serializer';
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
   *     if (state == null) {
   *       await AsyncStorage.removeItem('state-key-v1');
   *     } else {
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

const PARSE_STATE_ERROR =
  'Failed to parse the restored navigation state. The state will be initialized based on the navigation tree.';

const PERSIST_STATE_ERROR = 'Failed to persist the navigation state.';

const STRINGIFY_STATE_ERROR =
  'Failed to stringify the navigation state. The state will not be persisted.';

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
    (): InitialState | undefined | Thenable<InitialState | undefined> => {
      if (
        isPersistenceSupported === false ||
        rest.initialState != null ||
        persistor == null
      ) {
        return undefined;
      }

      const parse = (
        serializedState: string | undefined
      ): InitialState | undefined => {
        if (serializedState == null) {
          return undefined;
        }

        try {
          return persistor.parse
            ? persistor.parse(serializedState)
            : serializer.parse(serializedState, linking?.config);
        } catch (e) {
          console.error(PARSE_STATE_ERROR, e);

          return undefined;
        }
      };

      try {
        const result = persistor.restore();

        return result != null && typeof result === 'object' && 'then' in result
          ? result.then(parse, (e) => {
              console.error(RESTORE_STATE_ERROR, e);

              return undefined;
            })
          : parse(result);
      } catch (e) {
        console.error(RESTORE_STATE_ERROR, e);

        return undefined;
      }
    }
  );

  const onPersistState = (state: Readonly<NavigationState> | undefined) => {
    if (persistor == null) {
      return;
    }

    let serializedState: string | undefined;

    try {
      serializedState = persistor.stringify
        ? persistor.stringify(state)
        : serializer.stringify(state, linking?.config);
    } catch (e) {
      console.error(STRINGIFY_STATE_ERROR, e);

      return;
    }

    try {
      const value = persistor.persist(serializedState);

      if (value != null && typeof value === 'object' && 'then' in value) {
        // eslint-disable-next-line promise/catch-or-return
        value.then(undefined, (e) => {
          console.error(PERSIST_STATE_ERROR, e);
        });
      }
    } catch (e) {
      console.error(PERSIST_STATE_ERROR, e);
    }
  };

  const onSerializableCheck = (
    state: Readonly<NavigationState> | undefined
  ) => {
    if (process.env.NODE_ENV !== 'production' && state != null) {
      const result = checkSerializable(state, linking?.config);

      if (!result.serializable) {
        const breadcrumb = getStateBreadcrumb(state, result.location);

        const message = `Non-serializable values were found in the navigation state. Check:\n\n${breadcrumb} (${result.reason})\n\nThis can break usage such as persisting and restoring state. This might happen if you passed non-serializable values such as function, class instances etc. in params. If you need to use components with callbacks in your options, you can use 'navigation.setOptions' instead. See https://reactnavigation.org/docs/troubleshooting#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state for more details.`;

        warnOnce(true, message);
      }
    }
  };

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
            onPersistState(state);
            onSerializableCheck(state);
          }}
          ref={refContainer}
        />
      </LinkingContext.Provider>
    </LocaleDirContext.Provider>
  );
}
