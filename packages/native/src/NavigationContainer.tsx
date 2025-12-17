import {
  BaseNavigationContainer,
  getActionFromState,
  getPathFromState,
  getStateFromPath,
  type NavigationContainerProps,
  type NavigationContainerRef,
  type ParamListBase,
  type RootParamList,
  ThemeProvider,
  validatePathConfig,
} from '@react-navigation/core';
import * as React from 'react';
import { I18nManager } from 'react-native';

import { LinkingContext } from './LinkingContext';
import { LocaleDirContext } from './LocaleDirContext';
import { DefaultTheme } from './theming/DefaultTheme';
import type {
  DocumentTitleOptions,
  LinkingOptions,
  LocaleDirection,
} from './types';
import { useBackButton } from './useBackButton';
import { useDocumentTitle } from './useDocumentTitle';
import { useLinking } from './useLinking';
import { useThenable } from './useThenable';

declare global {
  var REACT_NAVIGATION_DEVTOOLS: WeakMap<
    NavigationContainerRef<any>,
    { readonly linking: LinkingOptions<any> }
  >;
}

globalThis.REACT_NAVIGATION_DEVTOOLS = new WeakMap();

type Props<ParamList extends {}> = NavigationContainerProps & {
  /**
   * Initial state object for the navigation tree.
   *
   * If this is provided, deep link or URLs won't be handled on the initial render.
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
   * Fallback element to render until initial state is resolved from deep linking.
   *
   * Defaults to `null`.
   */
  fallback?: React.ReactNode;
  /**
   * Options to configure the document title on Web.
   *
   * Updating document title is handled by default,
   * unless `documentTitle.enabled` is `false`.
   */
  documentTitle?: DocumentTitleOptions;
};

function NavigationContainerInner(
  {
    direction = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr',
    theme = DefaultTheme,
    linking,
    fallback = null,
    documentTitle,
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
      REACT_NAVIGATION_DEVTOOLS.set(refContainer.current, {
        get linking() {
          return linkingConfig.options;
        },
      });
    }
  });

  const [isResolved, initialState] = useThenable(getInitialState);

  // FIXME
  // @ts-expect-error not sure why this is not working
  React.useImperativeHandle(ref, () => refContainer.current);

  const isLinkingReady =
    rest.initialState != null || !linkingConfig.options.enabled || isResolved;

  if (!isLinkingReady) {
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
            rest.initialState == null ? initialState : rest.initialState
          }
          ref={refContainer}
        />
      </LinkingContext.Provider>
    </LocaleDirContext.Provider>
  );
}

/**
 * Container component that manages the navigation state.
 * This should be rendered at the root wrapping the whole app.
 */
export const NavigationContainer = React.forwardRef(
  NavigationContainerInner
) as <ParamList extends {} = RootParamList>(
  props: Props<ParamList> & {
    ref?: React.Ref<NavigationContainerRef<ParamList>>;
  }
) => React.ReactElement;
