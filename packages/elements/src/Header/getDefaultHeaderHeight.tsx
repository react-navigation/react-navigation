import { Platform } from 'react-native';

import type { Layout } from '../types';

export default function getDefaultHeaderHeight(
  layout: Layout,
  modal: boolean,
  statusBarHeight: number
): number {
  let headerHeight;

  const isLandscape = layout.width > layout.height;

  if (Platform.OS === 'ios') {
    if (Platform.isPad) {
      if (modal) {
        headerHeight = 56;
      } else {
        headerHeight = 50;
      }
    } else {
      if (isLandscape) {
        headerHeight = 32;
      } else {
        if (modal) {
          headerHeight = 56;
        } else {
          headerHeight = 44;
        }
      }
    }
  } else if (Platform.OS === 'android') {
    headerHeight = 56;
  } else {
    headerHeight = 64;
  }

  return headerHeight + statusBarHeight;
}
