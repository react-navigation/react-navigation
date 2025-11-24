import * as React from 'react';

import { BottomTabAnimationContext } from './BottomTabAnimationContext';

export function useBottomTabAnimation() {
  const animation = React.useContext(BottomTabAnimationContext);

  if (animation === undefined) {
    throw new Error(
      "Couldn't find values for tab animation. Are you inside a screen in a Bottom Tab navigator?"
    );
  }

  return animation;
}
