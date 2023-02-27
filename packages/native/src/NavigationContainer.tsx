import {
  BaseNavigationContainer,
  getActionFromState,
  getPathFromState,
  getStateFromPath,
  NavigationContainerProps,
  NavigationContainerRef,
  ParamListBase,
  validatePathConfig,
} from '@react-navigation/core';
import * as React from 'react';

import { LinkingContext } from './LinkingContext';
import { DefaultTheme } from './theming/DefaultTheme';
import { ThemeProvider } from './theming/ThemeProvider';
import type { DocumentTitleOptions, LinkingOptions, Theme } from './types';
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

global.REACT_NAVIGATION_DEVTOOLS = new WeakMap();

type Props<ParamList extends {}> = NavigationContainerProps & {
  theme?: Theme;
  linking?: LinkingOptions<ParamList>;
  fallback?: React.ReactNode;
  documentTitle?: DocumentTitleOptions;
};

/**
 * Container component which holds the navigation state designed for React Native apps.
 * This should be rendered at the root wrapping the whole app.
 *
 * @param props.initialState Initial state object for the navigation tree. When deep link handling is enabled, this will override deep links when specified. Make sure that you don't specify an `initialState` when there's a deep link (`Linking.getInitialURL()`).
 * @param props.onReady Callback which is called after the navigation tree mounts.
 * @param props.onStateChange Callback which is called with the latest navigation state when it changes.
 * @param props.onUnhandledAction Callback which is called when an action is not handled.
 * @param props.theme Theme object for the navigators.
 * @param props.linking Options for deep linking. Deep link handling is enabled when this prop is provided, unless `linking.enabled` is `false`.
 * @param props.fallback Fallback component to render until we have finished getting initial state when linking is enabled. Defaults to `null`.
 * @param props.documentTitle Options to configure the document title on Web. Updating document title is handled by default unless `documentTitle.enabled` is `false`.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which refers to the navigation object containing helper methods.
 */
function NavigationContainerInner(
  {
    theme = DefaultTheme,
    linking,
    fallback = null,
    documentTitle,
    ...rest
  }: Props<ParamListBase>,
  ref?: React.Ref<NavigationContainerRef<ParamListBase> | null>
) {
  const isLinkingEnabled = linking ? linking.enabled !== false : false;

  if (linking?.config) {
    validatePathConfig(linking.config);
  }

  const refContainer =
    React.useRef<NavigationContainerRef<ParamListBase>>(null);

  useBackButton(refContainer);
  useDocumentTitle(refContainer, documentTitle);

  const { getInitialState } = useLinking(refContainer, {
    enabled: isLinkingEnabled,
    prefixes: [],
    ...linking,
  });

  // Add additional linking related info to the ref
  // This will be used by the devtools
  React.useEffect(() => {
    if (refContainer.current) {
      REACT_NAVIGATION_DEVTOOLS.set(refContainer.current, {
        get linking() {
          return {
            ...linking,
            enabled: isLinkingEnabled,
            prefixes: linking?.prefixes ?? [],
            getStateFromPath: linking?.getStateFromPath ?? getStateFromPath,
            getPathFromState: linking?.getPathFromState ?? getPathFromState,
            getActionFromState:
              linking?.getActionFromState ?? getActionFromState,
          };
        },
      });
    }
  });

  const [isResolved, initialState] = useThenable(getInitialState);

  React.useImperativeHandle(ref, () => refContainer.current);

  const linkingContext = React.useMemo(() => ({ options: linking }), [linking]);

  const isLinkingReady =
    rest.initialState != null || !isLinkingEnabled || isResolved;

  if (!isLinkingReady) {
    // This is temporary until we have Suspense for data-fetching
    // Then the fallback will be handled by a parent `Suspense` component
    return fallback as React.ReactElement;
  }

  return (
    <LinkingContext.Provider value={linkingContext}>
      <ThemeProvider value={theme}>
        <BaseNavigationContainer
          {...rest}
          initialState={
            rest.initialState == null ? initialState : rest.initialState
          }
          ref={refContainer}
        />
      </ThemeProvider>
    </LinkingContext.Provider>
  );
}

export const NavigationContainer = React.forwardRef(
  NavigationContainerInner
) as <RootParamList extends {} = ReactNavigation.RootParamList>(
  props: Props<RootParamList> & {
    ref?: React.Ref<NavigationContainerRef<RootParamList>>;
  }
) => React.ReactElement;
