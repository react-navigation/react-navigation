import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  Route,
  ParamListBase,
  NavigationProp,
  Descriptor,
  NavigationHelpers,
} from '@react-navigation/native';
import { DrawerNavigationState } from '@react-navigation/routers';
import { PanGestureHandler } from 'react-native-gesture-handler';

export type Scene = {
  route: Route<string>;
  focused: boolean;
  color?: string;
};

export type DrawerNavigationConfig<T = DrawerContentOptions> = {
  /**
   * Position of the drawer on the screen. Defaults to `left`.
   */
  drawerPosition?: 'left' | 'right';
  /**
   * Type of the drawer. It determines how the drawer looks and animates.
   * - `front`: Traditional drawer which covers the screen with a overlay behind it.
   * - `back`: The drawer is revealed behind the screen on swipe.
   * - `slide`: Both the screen and the drawer slide on swipe to reveal the drawer.
   */
  drawerType?: 'front' | 'back' | 'slide';
  /**
   * How far from the edge of the screen the swipe gesture should activate.
   */
  edgeWidth?: number;
  /**
   * Whether the statusbar should be hidden when the drawer is pulled or opens,
   */
  hideStatusBar?: boolean;
  /**
   * Whether the keyboard should be dismissed when the swipe gesture begins.
   * Defaults to `'on-drag'`. Set to `'none'` to disable keyboard handling.
   */
  keyboardDismissMode?: 'on-drag' | 'none';
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
  statusBarAnimation?: 'slide' | 'none' | 'fade';
  /**
   * Props to pass to the underlying pan gesture handler.
   */
  gestureHandlerProps?: React.ComponentProps<typeof PanGestureHandler>;
  /**
   * Whether the screens should render the first time they are accessed. Defaults to `true`.
   * Set it to `false` if you want to render all screens on initial render.
   */
  lazy?: boolean;
  /**
   * Function that returns React element to render as the content of the drawer, for example, navigation items.
   * Defaults to `DrawerContent`.
   */
  drawerContent?: (props: DrawerContentComponentProps<T>) => React.ReactNode;
  /**
   * Options for the content component which will be passed as props.
   */
  drawerContentOptions?: T;
  /**
   * Style object for the component wrapping the screen content.
   */
  sceneContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Style object for the drawer component.
   * You can pass a custom background color for a drawer or a custom width here.
   */
  drawerStyle?: StyleProp<ViewStyle>;
};

export type DrawerNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;

  /**
   * Title string of a screen displayed in the drawer
   * or a function that given { focused: boolean, color: string } returns a React.Node
   * When undefined, scene title is used.
   */
  drawerLabel?:
    | string
    | ((props: { color: string; focused: boolean }) => React.ReactNode);

  /**
   * A function that given { focused: boolean, color: string } returns a React.Node to display an icon the drawer.
   */
  drawerIcon?: (props: {
    color: string;
    size: number;
    focused: boolean;
  }) => React.ReactNode;

  /**
   * Whether you can use gestures to open or close the drawer.
   * Defaults to `true`
   */
  gestureEnabled?: boolean;
  /**
   * Whether this screen should be unmounted when navigating away from it.
   * Defaults to `false`.
   */
  unmountOnBlur?: boolean;
};

export type DrawerContentComponentProps<T = DrawerContentOptions> = T & {
  state: DrawerNavigationState;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
  /**
   * Animated node which represents the current progress of the drawer's open state.
   * `0` is closed, `1` is open.
   */
  progress: Animated.Node<number>;
};

export type DrawerContentOptions = {
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
   * Style object for the single item, which can contain an icon and/or a label.
   */
  itemStyle?: StyleProp<ViewStyle>;
  /**
   * Style object to apply to the `Text` inside content section which renders a label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the content section.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Style object for the wrapper view.
   */
  style?: StyleProp<ViewStyle>;
};

export type DrawerNavigationEventMap = {
  /**
   * Event which fires when the drawer opens.
   */
  drawerOpen: { data: undefined };
  /**
   * Event which fires when the drawer closes.
   */
  drawerClose: { data: undefined };
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
