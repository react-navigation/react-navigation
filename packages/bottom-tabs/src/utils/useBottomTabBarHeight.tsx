import * as React from 'react';
import warnOnce from 'warn-once';

import BottomTabBarHeightContext from './BottomTabBarHeightContext';

export default function useFloatingBottomTabBarHeight(ignore_warning = false) {
  const height = React.useContext(BottomTabBarHeightContext);

  if (height === undefined) {
    if(!ignore_warning)
      warnOnce(
        true,
        "Couldn't find the bottom tab bar height (will return 0). Are you inside a screen in Bottom Tab Navigator?\n\nYou can ignore this warning by passing true to the useBottomTabBarHeight hook.\nuseBottomTabBarHeight(true)\n"
      );
    return 0;
  }

  return height;
}
