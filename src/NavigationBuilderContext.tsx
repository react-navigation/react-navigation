import * as React from 'react';
import { NavigationProp, NavigationAction } from './types';

export type ChildActionListener = (
  action: NavigationAction,
  sourceRouteKey?: string
) => boolean;

const NavigationBuilderContext = React.createContext<{
  navigation?: NavigationProp;
  onAction?: (action: NavigationAction, sourceNavigatorKey?: string) => boolean;
  addActionListener?: (listener: ChildActionListener) => void;
  removeActionListener?: (listener: ChildActionListener) => void;
  onRouteFocus?: (key: string) => void;
}>({});

export default NavigationBuilderContext;
