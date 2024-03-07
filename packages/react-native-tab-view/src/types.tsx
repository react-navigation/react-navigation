import type { Animated, StyleProp, TextStyle } from 'react-native';
import type { PagerViewProps } from 'react-native-pager-view';

export type TabDescriptor<T extends Route> = {
  accessibilityLabel?: string;
  labelStyle?: StyleProp<TextStyle>;
  accessible?: boolean;
  testID?: string;
  labelText?: string;
  labelAllowFontScaling?: boolean;
  href?: string;
  label?: (props: {
    focused: boolean;
    color: string;
    style?: StyleProp<TextStyle>;
    allowFontScaling?: boolean;
    label?: string;
    route: T;
  }) => React.ReactElement;
  icon?: (props: {
    focused: boolean;
    color: string;
    size: number;
    route: T;
  }) => React.ReactElement;
  badge?: () => React.ReactElement;
};

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
};
