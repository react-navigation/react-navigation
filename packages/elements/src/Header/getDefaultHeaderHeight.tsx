import { PixelRatio, Platform } from 'react-native';

import { isLiquidGlassSupported } from '../LiquidGlassView';

export function getDefaultHeaderHeight({
  landscape,
  modalPresentation,
  topInset,
}: {
  landscape: boolean;
  modalPresentation: boolean;
  topInset: number;
}): number {
  let headerHeight;

  // On models with Dynamic Island the status bar height is smaller than the safe area top inset.
  const hasDynamicIsland = Platform.OS === 'ios' && topInset > 50;
  const statusBarHeight = Math.max(
    topInset - (hasDynamicIsland ? 5 + 1 / PixelRatio.get() : 0),
    0
  );

  if (Platform.OS === 'ios') {
    if (isLiquidGlassSupported) {
      if (modalPresentation && !Platform.isPad && !Platform.isTV) {
        headerHeight = 70;
      } else {
        if (hasDynamicIsland) {
          headerHeight = 60;
        } else {
          headerHeight = 64;
        }
      }
    } else {
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
    }
  } else {
    headerHeight = 64;
  }

  return headerHeight + statusBarHeight;
}
