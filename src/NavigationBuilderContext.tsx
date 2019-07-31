import * as React from 'react';
import { NavigationAction } from './types';

export type ChildActionListener = (
  action: NavigationAction,
  visitedNavigators?: Set<string>,
  targetForInternalDispatching?: string | null
) => boolean;

const NavigationBuilderContext = React.createContext<{
  onAction?: (
    action: NavigationAction,
    visitedNavigators?: Set<string>
  ) => boolean;
  addActionListener?: (listener: ChildActionListener) => void;
  removeActionListener?: (listener: ChildActionListener) => void;
  onRouteFocus?: (key: string) => void;
}>({});

export default NavigationBuilderContext;
