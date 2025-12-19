import { type SafeAreaInsets, type Spec } from './NativeReactNavigationImpl';

export const zeroInsets: SafeAreaInsets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const NativeReactNavigation: Partial<Spec> = {
  cornersInsetsForVerticalAdaptivity: () => zeroInsets,
  cornersInsetsForHorizontalAdaptivity: () => zeroInsets,
};
