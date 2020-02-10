import * as React from 'react';
import {
  NavigationAction,
  NavigationState,
  ParamListBase,
} from '@react-navigation/routers';
import { NavigationHelpers } from './types';

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

export type NavigatorStateGetter = () => NavigationState;

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
  addStateGetter?: (key: string, getter: NavigatorStateGetter) => void;
  trackAction: (action: NavigationAction) => void;
}>({
  trackAction: () => undefined,
});

export default NavigationBuilderContext;
