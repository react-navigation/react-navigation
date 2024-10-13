import * as React from 'react';
import type { StyleProp, View, ViewStyle } from 'react-native';
import type { PanGesture } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';

export type Layout = { width: number; height: number };

export type DrawerProps = {
  /**
   * Whether the drawer is open or not.
   */
  open: boolean;

  /**
   * Callback which is called when the drawer is opened.
   */
  onOpen: () => void;

  /**
   * Callback which is called when the drawer is closed.
   */
  onClose: () => void;

  /**
   * Callback which is called when a gesture starts.
   */
  onGestureStart?: () => void;

  /**
   * Callback which is called when a gesture is cancelled.
   */
  onGestureCancel?: () => void;

  /**
   * Callback which is called when a gesture ends.
   */
  onGestureEnd?: () => void;

  /**
   * Callback which is called when the opening/closing transition starts.
   */
  onTransitionStart?: (closing: boolean) => void;

  /**
   * Callback which is called when the opening/closing transition ends.
   */
  onTransitionEnd?: (closing: boolean) => void;

  /**
   * Callback which returns a react element to render as the content of the drawer.
   */
  renderDrawerContent: () => React.ReactNode;

  /**
   * Object containing the layout of the container.
   * Defaults to the dimensions of the application's window.
   */
  layout?: { width: number; height: number };

  /**
   * Locale direction of the drawer.
   * Defaults to `rtl` when `I18nManager.isRTL` is `true` on Android & iOS, otherwise `ltr`.
   */
  direction?: 'ltr' | 'rtl';

  /**
   * Position of the drawer on the screen.
   * Defaults to `right` in RTL mode, otherwise `left`.
   */
  drawerPosition?: 'left' | 'right';

  /**
   * Type of the drawer. It determines how the drawer looks and animates.
   * - `front`: Traditional drawer which covers the screen with a overlay behind it.
   * - `back`: The drawer is revealed behind the screen on swipe.
   * - `slide`: Both the screen and the drawer slide on swipe to reveal the drawer.
   * - `permanent`: A permanent drawer is shown as a sidebar.
   *
   * Defaults to `slide` on iOS and `front` on other platforms.
   */
  drawerType?: 'front' | 'back' | 'slide' | 'permanent';

  /**
   * Style object for the drawer component.
   * You can pass a custom background color for drawer or a custom width here.
   */
  drawerStyle?: StyleProp<ViewStyle>;

  /**
   * Style object for the drawer overlay.
   */
  overlayStyle?: StyleProp<ViewStyle>;

  /**
   * Accessibility label for the overlay. This is read by the screen reader when the user taps the overlay.
   * Defaults to "Close drawer".
   */
  overlayAccessibilityLabel?: string;

  /**
   * Whether the keyboard should be dismissed when the swipe gesture begins.
   * Defaults to `'on-drag'`. Set to `'none'` to disable keyboard handling.
   */
  keyboardDismissMode?: 'none' | 'on-drag';

  /**
   * Whether the statusbar should be hidden when the drawer is pulled or opens.
   * Defaults to `false`.
   */
  hideStatusBarOnOpen?: boolean;

  /**
   * Animation of the statusbar when hiding it. Use in combination with `hideStatusBarOnOpen`.
   */
  statusBarAnimation?: 'slide' | 'fade' | 'none';

  /**
   * Whether you can use swipe gestures to open or close the drawer.
   * Defaults to `true`.
   * This is not supported on Web.
   */
  swipeEnabled?: boolean;

  /**
   * How far from the edge of the screen the swipe gesture should activate.
   * Defaults to `32`.
   * This is not supported on Web.
   */
  swipeEdgeWidth?: number;

  /**
   * Minimum swipe distance that should activate opening the drawer.
   * Defaults to `60`.
   * This is not supported on Web.
   */
  swipeMinDistance?: number;

  /**
   * Minimum swipe velocity that should activate opening the drawer.
   * Defaults to `500`.
   * This is not supported on Web.
   */
  swipeMinVelocity?: number;

  /**
   * Function to modify the pan gesture handler via RNGH properties API.
   */
  configureGestureHandler?: (gesture: PanGesture) => PanGesture;

  /**
   * Style object for the wrapper view.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Content that the drawer should wrap.
   */
  children: React.ReactNode;
};

export type OverlayProps = React.ComponentProps<typeof View> & {
  open: boolean;
  progress: SharedValue<number>;
  onPress: () => void;
  accessibilityLabel?: string;
};
