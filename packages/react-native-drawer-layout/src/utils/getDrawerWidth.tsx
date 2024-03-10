import {
  Platform,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

const getDefaultDrawerWidth = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => {
  /**
   * Default drawer width is screen width - header height
   * with a max width of 280 on mobile and 320 on tablet
   * https://material.io/components/navigation-drawer
   */
  const smallerAxisSize = Math.min(height, width);
  const isLandscape = width > height;
  const isTablet = smallerAxisSize >= 600;
  const appBarHeight = Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
  const maxWidth = isTablet ? 320 : 280;

  return Math.min(smallerAxisSize - appBarHeight, maxWidth);
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
