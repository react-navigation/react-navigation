import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

const APPROX_APP_BAR_HEIGHT = 56;
const DEFAULT_DRAWER_WIDTH = 360;

const getDefaultDrawerWidth = ({ width }: { width: number }) => {
  /**
   * Default drawer width is 360dp
   * On screens smaller than 320dp, ideally the drawer would collapse to a navigation bar
   * https://m3.material.io/components/navigation-drawer/specs
   */
  if (width - APPROX_APP_BAR_HEIGHT <= 360) {
    return width - APPROX_APP_BAR_HEIGHT;
  }

  return DEFAULT_DRAWER_WIDTH;
};

export function getDrawerWidth({
  layout,
  drawerStyle,
}: {
  layout: { width: number; height: number };
  drawerStyle?: StyleProp<ViewStyle>;
}) {
  const { width = getDefaultDrawerWidth(layout) } =
    StyleSheet.flatten(drawerStyle) || {};

  if (typeof width === 'string' && width.endsWith('%')) {
    // Try to calculate width if a percentage is given
    const percentage = Number(width.replace(/%$/, ''));

    if (Number.isFinite(percentage)) {
      return layout.width * (percentage / 100);
    }
  }

  return typeof width === 'number' ? width : 0;
}
