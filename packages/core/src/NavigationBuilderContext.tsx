import * as React from 'react';
import { NavigationAction, NavigationHelpers, ParamListBase } from './types';

export type ChildActionListener = (
  action: NavigationAction,
  visitedNavigators?: Set<string>
) => boolean;

export type FocusedNavigationCallback<T> = (
  navigation: NavigationHelpers<ParamListBase>
) => T;

export type FocusedNavigationListener = <T>(
  callback: FocusedNavigationCallback<T>
) => { handled: boolean; result: T };

/**
 * Context which holds the required helpers needed to build nested navigators.
 */
const NavigationBuilderContext = React.createContext<{
  onAction?: (
    action: NavigationAction,
    visitedNavigators?: Set<string>
  ) => boolean;
  addActionListener?: (listener: ChildActionListener) => void;
  addFocusedListener?: (listener: FocusedNavigationListener) => void;
  onRouteFocus?: (key: string) => void;
  trackAction: (key: string, action: NavigationAction) => void;
}>({
  trackAction: () => undefined,
});

export default NavigationBuilderContext;
