import * as React from 'react';

import { AnimatedHeaderHeightContext } from './AnimatedHeaderHeightContext';

export function useAnimatedHeaderHeight() {
  const animatedValue = React.useContext(AnimatedHeaderHeightContext);

  if (animatedValue === undefined) {
    throw new Error(
      "Couldn't find the header height. Are you inside a screen in a navigator with a header?"
    );
  }

  return animatedValue;
}
