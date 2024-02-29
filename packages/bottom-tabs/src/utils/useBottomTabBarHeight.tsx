import * as React from 'react';

import { BottomTabBarHeightContext } from './BottomTabBarHeightContext';

export function useBottomTabBarHeight() {
  const height = React.useContext(BottomTabBarHeightContext);

  if (height === undefined) {
    console.warn(
      "Couldn't find the bottom tab bar height. Are you inside a screen in Bottom Tab Navigator?"
    );
    return 0;
  }

  return height;
}
