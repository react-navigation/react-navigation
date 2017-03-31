// @flow

import { createTransition } from '../transitionHelpers';

const CrossFade = createTransition({
  getStyleMap(
    itemsOnFromRoute: Array<*>, 
    itemsOnToRoute: Array<*>, 
  ) {
    const fade = (outputRange) => (result, item) => {
      result[item.id] = { opacity: { outputRange } };
      return result;
    }
    return {
      from: itemsOnFromRoute.reduce(fade([1, 0]), {}),
      to: itemsOnToRoute.reduce(fade([0, 1]), {}),
    }
  }
});

export default CrossFade;