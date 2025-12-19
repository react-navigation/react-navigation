export const NativeReactNavigation = {
  cornersInsetsForVerticalAdaptivity: () => {},
  cornersInsetsForHorizontalAdaptivity: () => {},
  onCornersInsetsChanged(_: () => void) {
    // No-op
    return {
      remove: () => {
        // No-op
      },
    };
  },
};
