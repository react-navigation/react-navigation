/* @flow */

import type { NavigationState, Route, Layout } from './TabViewTypeDefinitions';

export type TransitionProps = {
  progress: number;
}

export type TransitionSpec = {
  timing: Function;
}

export type TransitionConfigurator = (currentTransitionProps: TransitionProps, nextTransitionProps: TransitionProps) => ?TransitionSpec

export type TransitionerProps = {
  navigationState: NavigationState;
  configureTransition?: TransitionConfigurator;
  onRequestChangeTab: (index: number) => void;
  onChangePosition?: (value: number) => void;
  initialLayout?: Layout;
  canJumpToTab?: (route: Route) => boolean;
}
