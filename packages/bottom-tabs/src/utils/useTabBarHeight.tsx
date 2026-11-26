import * as React from 'react';

import { TabBarLayoutContext } from './TabBarLayoutContext';

export function useTabBarHeight() {
  const layout = React.use(TabBarLayoutContext);

  if (layout === undefined) {
    throw new Error(
      "Couldn't find the bottom tab bar height. Are you inside a screen in Bottom Tab Navigator?"
    );
  }

  return layout.height;
}
