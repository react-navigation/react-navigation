// @flow

import { createTransition } from '../transitionHelpers';
import { TransitionItem } from '../TransitionItems';

const CrossFade = createTransition({
  getStyleMap(
    itemsOnFromRoute: Array<TransitionItem>, 
    itemsOnToRoute: Array<TransitionItem>, 
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