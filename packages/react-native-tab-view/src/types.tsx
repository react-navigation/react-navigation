import * as React from 'react';
import type { Animated, StyleProp, TextStyle, ViewStyle } from 'react-native';

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

export type TabViewPagerProps = {
  keyboardDismissMode?: 'none' | 'on-drag' | 'auto';
  swipeEnabled?: boolean;
  animationEnabled?: boolean;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
};

export type CommonPagerProps<T extends Route> = TabViewPagerProps & {
  layout: Layout;
  onIndexChange: (index: number) => void;
  onTabSelect?: (props: { index: number }) => void;
  navigationState: NavigationState<T>;
  layoutDirection?: LocaleDirection;
  children: (
    props: EventEmitterProps & {
      // Animated value which represents the state of current index
      // It can include fractional digits as it represents the intermediate value
      position: Animated.AnimatedInterpolation<number>;
      // Function to actually render the content of the pager
      // The parent component takes care of rendering
      render: (children: React.ReactNode) => React.ReactNode;
      // Callback to call when switching the tab
      // The tab switch animation is performed even if the index in state is unchanged
      jumpTo: (key: string) => void;
    }
  ) => React.ReactElement;
};
