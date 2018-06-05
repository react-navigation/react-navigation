/* @flow */

import { Animated } from 'react-native';
import type { Node } from 'react';

export type Route<T: { key: string }> = $Exact<T>;

export type NavigationState<T> = {
  index: number,
  routes: Array<T>,
};

export type Scene<T> = {
  route: T,
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
  animationEnabled?: boolean,
  swipeEnabled?: boolean,
  onSwipeStart?: () => mixed,
  onSwipeEnd?: () => mixed,
  onAnimationEnd?: () => mixed,
  canJumpToTab: (scene: Scene<T>) => boolean,
  getTestID: (scene: Scene<T>) => ?string,
};

export type PagerExtraProps = {
  keyboardDismissMode?: 'none' | 'on-drag',
  swipeDistanceThreshold?: number,
  swipeVelocityThreshold?: number,
};
