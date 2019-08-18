import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  Route,
  ParamListBase,
  NavigationProp,
  Descriptor,
  NavigationHelpers,
} from '@navigation-ex/core';
import { DrawerNavigationState } from '@navigation-ex/routers';
import { PanGestureHandler } from 'react-native-gesture-handler';

export type Scene = {
  route: Route<string>;
  index: number;
  focused: boolean;
  tintColor?: string;
};

export type DrawerNavigationConfig = {
  drawerBackgroundColor: string;
  drawerPosition: 'left' | 'right';
  drawerType: 'front' | 'back' | 'slide';
  drawerWidth: number | (() => number);
  edgeWidth?: number;
  hideStatusBar: boolean;
  keyboardDismissMode: 'on-drag' | 'none';
  minSwipeDistance?: number;
  overlayColor?: string;
  statusBarAnimation: 'slide' | 'none' | 'fade';
  gestureHandlerProps?: React.ComponentProps<typeof PanGestureHandler>;
  lazy: boolean;
  unmountInactiveRoutes?: boolean;
  contentComponent: React.ComponentType<ContentComponentProps>;
  contentOptions?: object;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export type DrawerNavigationOptions = {
  title?: string;
  drawerLabel?:
    | string
    | ((props: { tintColor?: string; focused: boolean }) => React.ReactElement);
  drawerIcon?: (props: {
    tintColor?: string;
    focused: boolean;
  }) => React.ReactElement;
  drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open';
};

export type ContentComponentProps = DrawerNavigationItemsProps & {
  navigation: NavigationHelpers<ParamListBase>;
  descriptors: { [key: string]: any };
  drawerOpenProgress: Animated.Node<number>;
};

export type DrawerNavigationItemsProps = {
  items: Route<string>[];
  activeItemKey?: string | null;
  activeTintColor?: string;
  activeBackgroundColor?: string;
  inactiveTintColor?: string;
  inactiveBackgroundColor?: string;
  getLabel: (scene: Scene) => React.ReactNode;
  renderIcon: (scene: Scene) => React.ReactNode;
  onItemPress: (scene: { route: Route<string>; focused: boolean }) => void;
  itemsContainerStyle?: ViewStyle;
  itemStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  activeLabelStyle?: StyleProp<TextStyle>;
  inactiveLabelStyle?: StyleProp<TextStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  drawerPosition: 'left' | 'right';
};

export type DrawerNavigationEventMap = {
  drawerOpen: undefined;
  drawerClose: undefined;
};

export type DrawerNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  DrawerNavigationState,
  DrawerNavigationOptions,
  DrawerNavigationEventMap
> & {
  /**
   * Open the drawer sidebar.
   */
  openDrawer(): void;

  /**
   * Close the drawer sidebar.
   */
  closeDrawer(): void;

  /**
   * Open the drawer sidebar if closed, or close if opened.
   */
  toggleDrawer(): void;
};

export type DrawerDescriptor = Descriptor<
  ParamListBase,
  string,
  DrawerNavigationState,
  DrawerNavigationOptions
>;

export type DrawerDescriptorMap = {
  [key: string]: DrawerDescriptor;
};
