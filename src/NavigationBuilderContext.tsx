import * as React from 'react';
import { NavigationHelpers, NavigationAction, NavigationState } from './types';

export type ChildActionListener = (
  action: NavigationAction,
  sourceRouteKey?: string
) => boolean;

const NavigationBuilderContext = React.createContext<{
  navigation?: NavigationHelpers;
  onAction?: (action: NavigationAction, sourceNavigatorKey?: string) => boolean;
  addActionListener?: (listener: ChildActionListener) => void;
  removeActionListener?: (listener: ChildActionListener) => void;
  onChildUpdate?: (
    state: NavigationState,
    focus: boolean,
    key: string | undefined
  ) => void;
}>({});

export default NavigationBuilderContext;
