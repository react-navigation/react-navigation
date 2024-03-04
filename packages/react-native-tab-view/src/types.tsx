import type { Animated } from 'react-native';
import type { PagerViewProps } from 'react-native-pager-view';

export type LocaleDirection = 'ltr' | 'rtl';

export type Route = {
  key: string;
  icon?: string;
  title?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  testID?: string;
};

export type Event = {
  defaultPrevented: boolean;
  preventDefault(): void;
};

export type Scene<T extends Route> = {
  route: T;
};

export type NavigationState<T extends Route> = {
  index: number;
  routes: T[];
};

export type Layout = {
  width: number;
  height: number;
};

export type Listener = (value: number) => void;

export type SceneRendererProps = {
  layout: Layout;
  position: Animated.AnimatedInterpolation<number>;
  jumpTo: (key: string) => void;

  /**
   * Whether to use js thread or native UI thread for running animations.
   * Setting it true will run animations on UI thread else will run on js thread.
   * Deafult value is set to true.
   */
  useNativeDriver?: boolean;
};

export type EventEmitterProps = {
  addEnterListener: (listener: Listener) => () => void;
};

export type PagerProps = Omit<
  PagerViewProps,
  | 'initialPage'
  | 'scrollEnabled'
  | 'onPageScroll'
  | 'onPageSelected'
  | 'onPageScrollStateChanged'
  | 'keyboardDismissMode'
  | 'children'
> & {
  keyboardDismissMode?: 'none' | 'on-drag' | 'auto';
  swipeEnabled?: boolean;
  animationEnabled?: boolean;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;

  /**
   * Whether to use js thread or native UI thread for running animations.
   * Setting it true will run animations on UI thread else will run on js thread.
   * Deafult value is set to true.
   */
  useNativeDriver?: boolean;
};
