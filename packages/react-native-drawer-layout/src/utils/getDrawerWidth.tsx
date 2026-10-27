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
  const defaultWidth = Math.max(
    layout.width - APPROX_APP_BAR_HEIGHT <= 360
      ? layout.width - APPROX_APP_BAR_HEIGHT
      : DEFAULT_DRAWER_WIDTH,
    0
  );

  let { width = defaultWidth, maxWidth = layout.width } =
    StyleSheet.flatten(drawerStyle) || {};

  if (typeof width === 'string' && width.endsWith('%')) {
    // Try to calculate width if a percentage is given
    const percentage = Number(width.replace(/%$/, ''));

    if (Number.isFinite(percentage)) {
      width = layout.width * (percentage / 100);
    }
  }

  if (typeof maxWidth === 'string' && maxWidth.endsWith('%')) {
    const percentage = Number(maxWidth.replace(/%$/, ''));

    if (Number.isFinite(percentage)) {
      maxWidth = layout.width * (percentage / 100);
    }
  }

  return Math.min(
    typeof width === 'number' ? width : defaultWidth,
    typeof maxWidth === 'number' ? maxWidth : layout.width
  );
}

export function getDrawerWidthWeb({
  drawerStyle,
}: {
  drawerStyle?: StyleProp<ViewStyle>;
}): string {
  const { width } = StyleSheet.flatten(drawerStyle) || {};

  if (typeof width === 'number') {
    return `${width}px`;
  }

  if (typeof width === 'string') {
    return width;
  }

  return DRAWER_DEFAULT_WIDTH_WEB;
}
