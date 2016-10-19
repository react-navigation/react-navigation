/* @flow */

import type { NavigationState, Route } from './TabViewTypeDefinitions';

export type TransitionProps = {
  progress: number
}

export type TransitionSpec = {
  timing: Function
}

export type TransitionConfigurator = (currentTransitionProps: TransitionProps, nextTransitionProps: TransitionProps) => ?TransitionSpec

export type TransitionerProps = {
  navigationState: NavigationState;
  configureTransition?: TransitionConfigurator;
  canJumpToTab?: (route: Route) => boolean;
  onRequestChangeTab: (index: number) => void;
  onChangePosition?: (value: number) => void;
  shouldOptimizeUpdates?: boolean;
}
