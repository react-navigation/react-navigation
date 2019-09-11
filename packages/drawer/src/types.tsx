import {
  NavigationScreenProp,
  NavigationState,
  NavigationRoute,
  NavigationParams,
  NavigationProp,
  NavigationDescriptor,
} from 'react-navigation';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';

export type Scene = {
  route: NavigationRoute;
  index: number;
  focused: boolean;
  tintColor?: string;
};

export type NavigationDrawerState = NavigationState & {
  isDrawerOpen: boolean;
};

export type NavigationDrawerProp<
  State = NavigationRoute,
  Params = NavigationParams
> = NavigationScreenProp<State, Params> & {
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  jumpTo: (routeName: string, key?: string) => void;
};

export type NavigationDrawerOptions = {
  title?: string;
  drawerLabel?:
    | React.ReactNode
    | ((props: { tintColor?: string; focused: boolean }) => React.ReactNode);
  drawerIcon?:
    | React.ReactNode
    | ((props: { tintColor?: string; focused: boolean }) => React.ReactNode);
  drawerLockMode?: 'locked-closed' | 'locked-open';
};

export type NavigationDrawerConfig = {
  drawerWidth?: number | (() => number);
  contentComponent?: React.ComponentType<ContentComponentProps>;
  drawerPosition?: 'left' | 'right';
  drawerType?: 'front' | 'back' | 'slide';
  keyboardDismissMode?: 'none' | 'on-drag';
  swipeEdgeWidth?: number;
  swipeDistanceThreshold?: number;
  swipeVelocityThreshold?: number;
  hideStatusBar?: boolean;
  statusBarAnimation?: 'slide' | 'none' | 'fade';
  drawerBackgroundColor?: ThemedColor;
  overlayColor?: ThemedColor;
};

export type NavigationDrawerRouterConfig = {
  unmountInactiveRoutes?: boolean;
  resetOnBlur?: boolean;
  initialRouteName?: string;
  contentComponent?: React.ComponentType<ContentComponentProps>;
  contentOptions?: object;
};

export type ThemedColor = {
  light: string;
  dark: string;
};

export type DrawerNavigatorItemsProps = {
  items: NavigationRoute[];
  activeItemKey?: string | null;
  activeTintColor?: string | ThemedColor;
  activeBackgroundColor?: string | ThemedColor;
  inactiveTintColor?: string | ThemedColor;
  inactiveBackgroundColor?: string | ThemedColor;
  getLabel: (scene: Scene) => React.ReactNode;
  renderIcon: (scene: Scene) => React.ReactNode;
  onItemPress: (scene: { route: NavigationRoute; focused: boolean }) => void;
  itemsContainerStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  activeLabelStyle?: StyleProp<TextStyle>;
  inactiveLabelStyle?: StyleProp<TextStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  drawerPosition: 'left' | 'right';
};

export type ContentComponentProps = DrawerNavigatorItemsProps & {
  navigation: NavigationProp<NavigationDrawerState>;
  descriptors: { [key: string]: any };
  drawerOpenProgress: Animated.Node<number>;
  screenProps: unknown;
};

export type SceneDescriptorMap = {
  [key: string]: NavigationDescriptor<
    NavigationParams,
    NavigationDrawerOptions,
    NavigationDrawerProp
  >;
};
