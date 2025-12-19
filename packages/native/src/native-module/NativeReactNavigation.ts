import type { SafeAreaInsets } from './NativeReactNavigationImpl';

const zeroInsets: SafeAreaInsets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const NativeReactNavigation = {
  isFullScreen: () => true,
  safeAreaLayoutForVerticalAdaptivity: () => zeroInsets,
  safeAreaLayoutForHorizontalAdaptivity: () => zeroInsets,
};
