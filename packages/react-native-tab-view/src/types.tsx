import Animated from 'react-native-reanimated';

export type Route = {
  key: string;
  icon?: string;
  title?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  testID?: string;
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
  position: Animated.Node<number>;
  jumpTo: (key: string) => void;
};

export type EventEmitterProps = {
  addListener: (type: 'enter', listener: Listener) => void;
  removeListener: (type: 'enter', listener: Listener) => void;
};

export type PagerCommonProps = {
  keyboardDismissMode: 'none' | 'on-drag';
  swipeEnabled: boolean;
  swipeDistanceThreshold?: number;
  swipeVelocityThreshold?: number;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  springConfig: {
    damping?: number;
    mass?: number;
    stiffness?: number;
    restSpeedThreshold?: number;
    restDisplacementThreshold?: number;
  };
  timingConfig: {
    duration?: number;
  };
};
