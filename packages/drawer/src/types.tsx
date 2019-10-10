import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  Route,
  ParamListBase,
  NavigationProp,
  Descriptor,
  NavigationHelpers,
} from '@react-navigation/core';
import { DrawerNavigationState } from '@react-navigation/routers';
import { PanGestureHandler } from 'react-native-gesture-handler';

export type Scene = {
  route: Route<string>;
  index: number;
  focused: boolean;
  color?: string;
};

export type DrawerNavigationConfig = {
  /**
   * Custom background color for the drawer. Defaults to `white`.
   */
  drawerBackgroundColor: string;
  /**
   * Position of the drawer on the screen. Defaults to `left`.
   */
  drawerPosition: 'left' | 'right';
  /**
   * Type of the drawer. It determines how the drawer looks and animates.
   * - `front`: Traditional drawer which covers the screen with a overlay behind it.
   * - `back`: The drawer is revealed behind the screen on swipe.
   * - `slide`: Both the screen and the drawer slide on swipe to reveal the drawer.
   */
  drawerType: 'front' | 'back' | 'slide';
  /**
   * Number or a function which returns the width of the drawer.
   * If a function is provided, it'll be called again when the screen's dimensions change.
   */
  drawerWidth: number | (() => number);
  /**
   * How far from the edge of the screen the swipe gesture should activate.
   */
  edgeWidth?: number;
  /**
   * Whether the statusbar should be hidden when the drawer is pulled or opens,
   */
  hideStatusBar: boolean;
  /**
   * Whether the keyboard should be dismissed when the swipe gesture begins.
   * Defaults to `'on-drag'`. Set to `'none'` to disable keyboard handling.
   */
  keyboardDismissMode: 'on-drag' | 'none';
  /**
   * Minimum swipe distance threshold that should activate opening the drawer.
   */
  minSwipeDistance?: number;
  /**
   * Color of the overlay to be displayed on top of the content view when drawer gets open.
   * The opacity is animated from `0` to `1` when the drawer opens.
   */
  overlayColor?: string;
  /**
   * Animation of the statusbar when hiding it. use in combination with `hideStatusBar`.
   */
  statusBarAnimation: 'slide' | 'none' | 'fade';
  /**
   * Props to pass to the underlying pan gesture handler.
   */
  gestureHandlerProps?: React.ComponentProps<typeof PanGestureHandler>;
  /**
   * Whether the screens should render the first time they are accessed. Defaults to `true`.
   * Set it to `false` if you want to render all screens on initial render.
   */
  lazy: boolean;
  /**
   * Whether a screen should be unmounted when navigating away from it.
   * Defaults to `false`.
   */
  unmountInactiveRoutes?: boolean;
  /**
   * Custom component used to render as the content of the drawer, for example, navigation items.
   * Defaults to `DrawerItems`.
   */
  contentComponent: React.ComponentType<ContentComponentProps>;
  /**
   * Options for the content component which will be passed as props.
   */
  contentOptions?: object;
  /**
   * Style object for the component wrapping the screen content.
   */
  sceneContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export type DrawerNavigationOptions = {
  title?: string;
  drawerLabel?:
    | string
    | ((props: { color?: string; focused: boolean }) => React.ReactElement);
  drawerIcon?: (props: {
    color?: string;
    focused: boolean;
  }) => React.ReactElement;
  drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open';
};

export type ContentComponentProps = DrawerNavigationItemsProps & {
  navigation: NavigationHelpers<ParamListBase>;
  descriptors: { [key: string]: any };
  /**
   * Animated node which represents the current progress of the drawer's open state.
   * `0` is closed, `1` is open.
   */
  drawerOpenProgress: Animated.Node<number>;
};

export type DrawerNavigationItemsProps = {
  /**
   * The array of routes, can be modified or overridden to control what's shown in the drawer.
   */
  items: Route<string>[];
  /**
   * Route key identifying the currently active route.
   */
  activeItemKey?: string | null;
  /**
   * Color for the icon and label in the active item in the drawer.
   */
  activeTintColor?: string;
  /**
   * Background color for the active item in the drawer.
   */
  activeBackgroundColor?: string;
  /**
   * Color for the icon and label in the inactive items in the drawer.
   */
  inactiveTintColor?: string;
  /**
   * Background color for the inactive items in the drawer.
   */
  inactiveBackgroundColor?: string;
  /**
   * Style object for the content section.
   */
  itemsContainerStyle?: ViewStyle;
  /**
   * Style object for the single item, which can contain an icon and/or a label.
   */
  itemStyle?: StyleProp<ViewStyle>;
  /**
   * Style object to overwrite `Text` style inside content section which renders a label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Style object to overwrite `Text` style of the active label.
   */
  activeLabelStyle?: StyleProp<TextStyle>;
  /**
   * Style object to overwrite `Text` style of the inactive label.
   */
  inactiveLabelStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the wrapper `View` of the icon.
   */
  iconContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Position of the drawer on the screen.
   */
  drawerPosition: 'left' | 'right';
  getLabel: (scene: Scene) => React.ReactNode;
  renderIcon: (scene: Scene) => React.ReactNode;
  onItemPress: (scene: { route: Route<string>; focused: boolean }) => void;
};

export type DrawerNavigationEventMap = {
  /**
   * Event which fires when the drawer opens.
   */
  drawerOpen: undefined;
  /**
   * Event which fires when the drawer closes.
   */
  drawerClose: undefined;
};

export type DrawerNavigationHelpers = NavigationHelpers<
  ParamListBase,
  DrawerNavigationEventMap
>;

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
