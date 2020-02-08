import * as React from 'react';
import {
  BaseNavigationContainer,
  NavigationContainerProps,
  NavigationContainerRef,
} from '@react-navigation/core';
import ThemeProvider from './theming/ThemeProvider';
import DefaultTheme from './theming/DefaultTheme';
import useBackButton from './useBackButton';
import { Theme } from './types';
import {
  useBrowserBackAndForwardListener,
  getInitialStateFromLocation,
  syncStateWithHistory,
} from './browserHistory';

type Props = NavigationContainerProps & {
  theme?: Theme;
};

/**
 * Container component which holds the navigation state
 * designed for mobile apps.
 * This should be rendered at the root wrapping the whole app.
 *
 * @param props.initialState Initial state object for the navigation tree.
 * @param props.onStateChange Callback which is called with the latest navigation state when it changes.
 * @param props.theme Theme object for the navigators.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which refers to the navigation object containing helper methods.
 */
const NavigationContainer = React.forwardRef(function NavigationContainer(
  { theme = DefaultTheme, initialState, onStateChange, ...rest }: Props,
  ref: React.Ref<NavigationContainerRef>
) {
  const refContainer = React.useRef<NavigationContainerRef>(null);

  useBackButton(refContainer);

  useBrowserBackAndForwardListener({ navigationRef: refContainer });

  const _initialState = React.useMemo(() => {
    return initialState ? initialState : getInitialStateFromLocation();
  }, [initialState]);

  const _onStateChange = React.useCallback(
    state => {
      syncStateWithHistory(state);
      onStateChange?.(state);
    },
    [onStateChange]
  );

  React.useImperativeHandle(ref, () => refContainer.current);

  return (
    <ThemeProvider value={theme}>
      <BaseNavigationContainer
        {...rest}
        initialState={_initialState}
        onStateChange={_onStateChange}
        ref={refContainer}
      />
    </ThemeProvider>
  );
});

export default NavigationContainer;
