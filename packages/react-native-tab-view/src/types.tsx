import * as React from 'react';
import type {
  Animated,
  ColorValue,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

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
    color: ColorValue;
    allowFontScaling?: boolean;
    style?: StyleProp<TextStyle>;
  }) => React.ReactNode;
  labelStyle?: StyleProp<TextStyle>;
  icon?: (props: {
    route: T;
    focused: boolean;
    color: ColorValue;
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

export type Listener = (event: { type: 'enter'; index: number }) => void;

export type SceneRendererProps = {
  position: Animated.AnimatedInterpolation<number>;
  jumpTo: (key: string) => void;
};

export type EventEmitterProps = {
  subscribe: (listener: Listener) => () => void;
};

export type AdapterCommonProps = {
  /**
   * Determines whether the keyboard gets dismissed in response to a drag.
   * - 'auto' (default) - the keyboard is dismissed on drag and tab changes
   * - 'on-drag' - the keyboard is dismissed when a drag begins
   * - 'none' - drags and tab changes do not dismiss the keyboard
   */
  keyboardDismissMode?: 'none' | 'on-drag' | 'auto';
  /**
   * Whether swiping between tabs is enabled.
   */
  swipeEnabled?: boolean;
  /**
   * Whether the tab switch animation is enabled.
   * If set to false, the tab switch will happen immediately without animation.
   */
  animationEnabled?: boolean;
  /**
   * Callback that is called when the swipe gesture starts.
   */
  onSwipeStart?: () => void;
  /**
   * Callback that is called when the swipe gesture ends.
   */
  onSwipeEnd?: () => void;
  /**
   * Callback that is called when a tab is selected.
   * This is called regardless of whether the index has changed or not.
   */
  onTabSelect?: (props: { index: number }) => void;
  /**
   * Style for the pager adapter.
   */
  style?: StyleProp<ViewStyle>;
};

export type AdapterRendererProps = {
  /**
   * Callback to call when the index changes.
   */
  onIndexChange: (index: number) => void;
  /**
   * The current navigation state of the tab view.
   */
  navigationState: NavigationState<Route>;
  /**
   * The writing direction of the layout.
   * This can be 'ltr' or 'rtl' based on tab view's `direction` prop.
   */
  layoutDirection?: LocaleDirection;
  /**
   * Render callback that should render the pages of the tab view.
   */
  children: (
    props: EventEmitterProps & {
      // Animated value which represents the state of current index
      // It can include fractional digits as it represents the intermediate value
      position: Animated.AnimatedInterpolation<number>;
      // Function to actually render the content of the pager
      // The parent component takes care of rendering
      render: (children: React.ReactElement[]) => React.ReactNode;
      // Callback to call when switching the tab
      // The tab switch animation is performed even if the index in state is unchanged
      jumpTo: (key: string) => void;
    }
  ) => React.ReactElement;
};

export type AdapterProps = AdapterRendererProps & AdapterCommonProps;
