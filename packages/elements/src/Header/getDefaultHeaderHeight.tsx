import { PixelRatio, Platform } from 'react-native';

import { isLiquidGlassSupported } from '../LiquidGlassView';
import { BUTTON_SIZE } from './HeaderButton';

export const LIQUID_GLASS_HEADER_BOTTOM_SPACING = 10;

export function getDefaultHeaderHeight({
  landscape,
  modalPresentation,
  topInset,
}: {
  landscape: boolean;
  modalPresentation: boolean;
  topInset: number;
}): number {
  if (Platform.OS === 'ios' && isLiquidGlassSupported) {
    let topSpacing;

    if (Platform.isPad) {
      // iPad shows the status bar in landscape as well
      // And native navigation bars use a smaller margin above the buttons in sheets
      topSpacing = modalPresentation ? 10 : topInset;
    } else if (landscape) {
      // The status bar is hidden in landscape
      // But native navigation bars still leave space above the buttons
      topSpacing = 24;
    } else if (modalPresentation) {
      // Sheets don't overlap the status bar
      // So native navigation bars use the standard margin above the buttons
      topSpacing = 16;
    } else {
      topSpacing = topInset;
    }

    if (topSpacing === 0) {
      topSpacing = LIQUID_GLASS_HEADER_BOTTOM_SPACING;
    }

    return topSpacing + BUTTON_SIZE + LIQUID_GLASS_HEADER_BOTTOM_SPACING;
  }

  let headerHeight;

  // On models with Dynamic Island the status bar height is smaller than the safe area top inset.
  const hasDynamicIsland = Platform.OS === 'ios' && topInset > 50;
  const statusBarHeight = Math.max(
    topInset - (hasDynamicIsland ? 5 + 1 / PixelRatio.get() : 0),
    0
  );

  if (Platform.OS === 'ios') {
    if (Platform.isPad || Platform.isTV) {
      if (modalPresentation) {
        headerHeight = 56;
      } else {
        headerHeight = 50;
      }
    } else {
      if (modalPresentation && !landscape) {
        headerHeight = 56;
      } else {
        headerHeight = 44;
      }
    }
  } else {
    headerHeight = 64;
  }

  return headerHeight + statusBarHeight;
}
