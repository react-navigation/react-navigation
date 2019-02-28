/* @flow */

import Animated from 'react-native-reanimated';

export type Route = { key: string } & $Shape<{
  icon?: string,
  title?: string,
  accessibilityLabel?: string,
  testID?: string,
  [key: string]: any,
}>;

export type Scene<T: Route> = {|
  route: T,
|};

export type NavigationState<T: Route> = {
  index: number,
  routes: T[],
};

export type Layout = {|
  width: number,
  height: number,
|};

export type Listener = (value: number) => mixed;

export type SceneRendererProps = {|
  layout: Layout,
  position: Animated.Node<number>,
  jumpTo: (key: string) => void,
  addListener: (type: 'position', listener: Listener) => void,
  removeListener: (type: 'position', listener: Listener) => void,
|};

export type PagerCommonProps = {|
  keyboardDismissMode: 'none' | 'on-drag',
  swipeEnabled: boolean,
  swipeDistanceThreshold?: number,
  swipeVelocityThreshold?: number,
  onSwipeStart?: () => mixed,
  onSwipeEnd?: () => mixed,
|};
