import {
  BaseNavigationContainer,
  getActionFromState,
  getPathFromState,
  getStateFromPath,
  type InitialState,
  type NavigationContainerProps,
  type NavigationContainerRef,
  type ParamListBase,
  type RootParamList,
  ThemeProvider,
  validatePathConfig,
} from '@react-navigation/core';
import * as React from 'react';
import { I18nManager, Platform } from 'react-native';

import { LinkingContext } from './LinkingContext';
import { LocaleDirContext } from './LocaleDirContext';
import { DefaultTheme } from './theming/DefaultTheme';
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
    NavigationContainerRef<any>,
    {
      readonly linking: LinkingOptions<any>;
      readonly listeners: Set<
        (data: { type: 'deeplink'; url: string }) => void
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
   *     await AsyncStorage.setItem('state-key-v1', JSON.stringify(state));
   *   },
   *   async restore() {
   *     const state = await AsyncStorage.getItem('state-key-v1');
   *
   *     return state ? JSON.parse(state) : undefined;
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
};

const RESTORE_STATE_ERROR =
  'Failed to restore navigation state. The state will be initialized based on the navigation tree.';

function NavigationContainerInner(
  {
    direction = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr',
    theme = DefaultTheme,
    linking,
    persistor,
    fallback = null,
    documentTitle,
    onStateChange,
    ...rest
  }: Props<ParamListBase>,
  ref?: React.Ref<NavigationContainerRef<ParamListBase> | null>
) {
  if (linking?.config) {
    validatePathConfig(linking.config);
  }

  const refContainer =
    React.useRef<NavigationContainerRef<ParamListBase>>(null);

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

  const isPersistenceSupported =
    Platform.OS === 'web' ? !linkingConfig.options.enabled : true;

  const [isPersistedStateResolved, initialStateFromPersisted] = useThenable(
    () => {
      if (
        isPersistenceSupported === false ||
        rest.initialState != null ||
        persistor == null
      ) {
        return undefined;
      }

      let restoredState;

      try {
        restoredState = persistor.restore();
      } catch (e) {
        console.error(RESTORE_STATE_ERROR, e);

        return undefined;
      }

      if (restoredState == null) {
        return undefined;
      }

      if ('then' in restoredState) {
        return restoredState.then(
          (state) => state,
          (error) => {
            console.error(RESTORE_STATE_ERROR, error);

            return undefined;
          }
        );
      }

      const thenable: Thenable<InitialState | undefined> = {
        then(onfulfilled) {
          return Promise.resolve(
            onfulfilled ? onfulfilled(restoredState) : restoredState
          );
        },
      };

      return thenable;
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
            persistor?.persist(state);
          }}
          ref={refContainer}
        />
      </LinkingContext.Provider>
    </LocaleDirContext.Provider>
  );
}

/**
 * Container component that manages the navigation state.
 *
 * This should be rendered at the root wrapping the whole app.
 */
export const NavigationContainer = React.forwardRef(
  NavigationContainerInner
) as <ParamList extends {} = RootParamList>(
  props: Props<ParamList> & {
    ref?: React.Ref<NavigationContainerRef<ParamList>>;
  }
) => React.ReactElement;
