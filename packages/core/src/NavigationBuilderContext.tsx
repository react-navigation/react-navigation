import type {
  NavigationAction,
  NavigationState,
  ParamListBase,
} from '@react-navigation/routers';
import * as React from 'react';

import type { NavigationHelpers } from './types';

export type MapValueType<A> = A extends Map<any, infer V> ? V : never;

export type KeyedListenerMap = {
  getState: Map<string, GetStateListener>;
  beforeRemove: Map<string, ChildBeforeRemoveListener>;
  action: Map<string, ChildActionListener>;
  focus: Map<string, FocusedNavigationListener>;
};

export type AddKeyedListener = <T extends keyof KeyedListenerMap>(
  type: T,
  key: string,
  listener: MapValueType<KeyedListenerMap[T]> | undefined
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
) => {
  handled: boolean;
  result: T;
};

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
  addKeyedListener?: AddKeyedListener;
  onRouteFocus?: (key: string) => void;
  onDispatchAction: (action: NavigationAction, noop: boolean) => void;
  onOptionsChange: (options: object) => void;
  stackRef?: React.MutableRefObject<string | undefined>;
}>({
  onDispatchAction: () => undefined,
  onOptionsChange: () => undefined,
});

export default NavigationBuilderContext;
