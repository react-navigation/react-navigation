import { Platform } from 'react-native';

import type { Layout } from '../types';

export default function getDefaultHeaderHeight(
  layout: Layout,
  modalPresentation: boolean,
  statusBarHeight: number
): number {
  let headerHeight;

  const isLandscape = layout.width > layout.height;

  if (Platform.OS === 'ios') {
    if (Platform.isPad || Platform.isTV) {
      if (modalPresentation) {
        headerHeight = 56;
      } else {
        headerHeight = 50;
      }
    } else {
      if (isLandscape) {
        headerHeight = 32;
      } else {
        if (modalPresentation) {
          headerHeight = 56;
        } else {
          headerHeight = 44;
        }
      }
    }
  } else {
    // android also uses 64 as it's height due to MD-v3 guideline specification
    headerHeight = 64;
  }

  return headerHeight + statusBarHeight;
}
