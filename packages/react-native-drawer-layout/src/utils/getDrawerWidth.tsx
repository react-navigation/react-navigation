import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

const APPROX_APP_BAR_HEIGHT = 56;
const DEFAULT_DRAWER_WIDTH = 360;

/**
 * Default drawer width is 360dp
 * On screens smaller than 320dp, ideally the drawer would collapse to a navigation bar
 * https://m3.material.io/components/navigation-drawer/specs
 */
const DRAWER_DEFAULT_WIDTH_WEB = `min(calc(100% - ${APPROX_APP_BAR_HEIGHT}px), ${DEFAULT_DRAWER_WIDTH}px)`;

export function getDrawerWidthNative({
  layout,
  drawerStyle,
}: {
  layout: { width: number; height: number };
  drawerStyle?: StyleProp<ViewStyle>;
}) {
  const defaultWidth =
    layout.width - APPROX_APP_BAR_HEIGHT <= 360
      ? layout.width - APPROX_APP_BAR_HEIGHT
      : DEFAULT_DRAWER_WIDTH;

  const { width = defaultWidth } = StyleSheet.flatten(drawerStyle) || {};

  if (typeof width === 'string' && width.endsWith('%')) {
    // Try to calculate width if a percentage is given
    const percentage = Number(width.replace(/%$/, ''));

    if (Number.isFinite(percentage)) {
      return layout.width * (percentage / 100);
    }
  }

  return typeof width === 'number' ? width : defaultWidth;
}

export function getDrawerWidthWeb({
  drawerStyle,
}: {
  drawerStyle?: StyleProp<ViewStyle>;
}) {
  const { width } = StyleSheet.flatten(drawerStyle) || {};

  return typeof width === 'string' || typeof width === 'number'
    ? width
    : DRAWER_DEFAULT_WIDTH_WEB;
}
