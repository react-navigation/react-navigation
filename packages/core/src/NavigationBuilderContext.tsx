import * as React from 'react';
import type {
  NavigationAction,
  NavigationState,
  ParamListBase,
} from '@react-navigation/routers';
import type { NavigationHelpers } from './types';

export type ListenerMap = {
  action: ChildActionListener;
  focus: FocusedNavigationListener;
};

export type KeyedListenerMap = {
  getState: GetStateListener;
  beforeRemove: ChildBeforeRemoveListener;
};

export type AddListener = <T extends keyof ListenerMap>(
  type: T,
  listener: ListenerMap[T]
) => void;

export type AddKeyedListener = <T extends keyof KeyedListenerMap>(
  type: T,
  key: string,
  listener: KeyedListenerMap[T]
) => void;

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

export type GetStateListener = () => NavigationState;

export type ChildBeforeRemoveListener = (action: NavigationAction) => boolean;

/**
 * Context which holds the required helpers needed to build nested navigators.
 */
const NavigationBuilderContext = React.createContext<{
  onAction?: (
    action: NavigationAction,
    visitedNavigators?: Set<string>
  ) => boolean;
  addListener?: AddListener;
  addKeyedListener?: AddKeyedListener;
  onRouteFocus?: (key: string) => void;
  onDispatchAction: (action: NavigationAction, noop: boolean) => void;
  onOptionsChange: (options: object) => void;
}>({
  onDispatchAction: () => undefined,
  onOptionsChange: () => undefined,
});

export default NavigationBuilderContext;
