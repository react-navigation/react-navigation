/* @flow */

import { Animated } from 'react-native';

export type Route<T: { key: string, testID?: string }> = T;

export type NavigationState<T: { key: string }> = {
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
  position: Animated.Value,
  jumpToIndex: (index: number) => void,
  getLastPosition: () => number,
  subscribe: (
    event: SubscriptionName,
    callback: Function,
  ) => { remove: Function },
};

export type SubscriptionName = 'reset' | 'position';
