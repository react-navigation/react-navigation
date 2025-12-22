import type { Insets } from 'react-native';

type CornerInsetsDirection = 'vertical' | 'horizontal';

export const NativeReactNavigation: {
  cornerInsetsForAdaptivity(direction: CornerInsetsDirection): Insets;
  onCornerInsetsChanged(listener: () => void): { remove(): void };
} = {
  cornerInsetsForAdaptivity: () => ({}),
  onCornerInsetsChanged(_: () => void) {
    // No-op
    return {
      remove: () => {
        // No-op
      },
    };
  },
};
