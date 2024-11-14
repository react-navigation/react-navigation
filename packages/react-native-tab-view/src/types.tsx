import type { Animated, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { PagerViewProps } from 'react-native-pager-view';

export type TabDescriptor<T extends Route> = {
  accessibilityLabel?: string;
  accessible?: boolean;
  testID?: string;
  labelText?: string;
  labelAllowFontScaling?: boolean;
  href?: string;
  label?: (props: {
    route: T;
    labelText?: string;
    focused: boolean;
    color: string;
    allowFontScaling?: boolean;
    style?: StyleProp<TextStyle>;
  }) => React.ReactNode;
  labelStyle?: StyleProp<TextStyle>;
  icon?: (props: {
    route: T;
    focused: boolean;
    color: string;
    size: number;
  }) => React.ReactNode;
  badge?: (props: { route: T }) => React.ReactElement;
  sceneStyle?: StyleProp<ViewStyle>;
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
