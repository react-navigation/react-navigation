/* @flow */

import { Animated } from 'react-native';
import type { Node } from 'react';
import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export type Route<T: { key: string }> = $Exact<T>;

export type NavigationState<T> = {
  index: number,
  routes: Array<T>,
};

export type Scene<T> = {
  route: T,
  focused: boolean,
  index: number,
};

export type Layout = {
  height: number,
  width: number,
};

export type SceneRendererProps<T> = {
  layout: Layout & {
    measured: boolean,
  },
  navigationState: NavigationState<T>,
  panX: Animated.Value,
  offsetX: Animated.Value,
  position: any,
  jumpTo: (key: string) => void,
  jumpToIndex: (index: number) => void, // Deprecated, use `jumpTo` instead
  useNativeDriver: boolean,
};

export type PagerRendererProps<T> = {
  layout: Layout & {
    measured: boolean,
  },
  navigationState: NavigationState<T>,
  panX: Animated.Value,
  offsetX: Animated.Value,
  canJumpToTab: (route: T) => boolean,
  jumpTo: (key: string) => void,
  useNativeDriver: boolean,
  animationEnabled?: boolean,
  swipeEnabled?: boolean,
  children: Node,
};

export type TransitionProps = {
  progress: number,
};

export type TransitionSpec = {
  timing: Function,
};

export type TransitionConfigurator = (
  currentTransitionProps: TransitionProps,
  nextTransitionProps: TransitionProps
) => TransitionSpec;

export type PagerProps<T> = {
  canJumpToTab: (route: T) => boolean,
  configureTransition?: TransitionConfigurator,
  animationEnabled?: boolean,
  swipeEnabled?: boolean,
  swipeDistanceThreshold?: number,
  swipeVelocityThreshold?: number,
};

export type Style = StyleObj;
