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
  jumpTo: (key: string) => mixed,
  jumpToIndex: (index: number) => mixed, // Deprecated, use `jumpTo` instead
  useNativeDriver: boolean,
};

export type PagerRendererProps<T> = PagerCommonProps<T> & {
  layout: Layout & {
    measured: boolean,
  },
  navigationState: NavigationState<T>,
  panX: Animated.Value,
  offsetX: Animated.Value,
  jumpTo: (key: string) => mixed,
  useNativeDriver: boolean,
  children: Node,
};

export type PagerCommonProps<T> = {
  canJumpToTab: (route: T) => boolean,
  animationEnabled?: boolean,
  swipeEnabled?: boolean,
  onSwipeStart?: () => mixed,
  onSwipeEnd?: () => mixed,
  onAnimationEnd?: () => mixed,
};

export type PagerExtraProps = {
  swipeDistanceThreshold?: number,
  swipeVelocityThreshold?: number,
};

export type Style = StyleObj;
