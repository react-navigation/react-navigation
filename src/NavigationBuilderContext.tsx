import * as React from 'react';
import { NavigationAction } from './types';

export type ChildActionListener = (
  action: NavigationAction,
  sourceRouteKey?: string,
  targetForInternalDispatching?: string | null
) => boolean;

const NavigationBuilderContext = React.createContext<{
  onAction?: (action: NavigationAction, sourceNavigatorKey?: string) => boolean;
  addActionListener?: (listener: ChildActionListener) => void;
  removeActionListener?: (listener: ChildActionListener) => void;
  onRouteFocus?: (key: string) => void;
}>({});

export default NavigationBuilderContext;
