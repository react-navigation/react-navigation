// @flow

import { createTransition } from '../transitionHelpers';

const Scale = createTransition({
  getStyleMap(
    itemsOnFromRoute: Array<*>, 
    itemsOnToRoute: Array<*>, 
  ) {
    const scale = (outputRange) => (result, item) => {
      result[item.id] = { scale: { outputRange } };
      return result;
    }
    return {
      from: itemsOnFromRoute.reduce(scale([1, 0]), {}),
      to: itemsOnToRoute.reduce(scale([0, 1]), {}),
    }
  }
});

export default Scale;