// @flow

import _ from 'lodash';
import { createTransition } from '../transitionHelpers';

const SharedElement = createTransition({
  getItemsToClone(
    itemsOnFromRoute: Array<*>, 
    itemsOnToRoute: Array<*> ) {
    const itemIdsOnBoth = _.intersectionWith(itemsOnFromRoute, itemsOnToRoute, (i1, i2) => i1.id === i2.id)
      .map(item => item.id);
    const onBoth = item => itemIdsOnBoth.includes(item.id);
    return itemsOnFromRoute.filter(onBoth);
  },
  getItemsToMeasure(
    itemsOnFromRoute: Array<*>, 
    itemsOnToRoute: Array<*> ) {
    const itemIdsOnBoth = _.intersectionWith(itemsOnFromRoute, itemsOnToRoute, (i1, i2) => i1.id === i2.id)
      .map(item => item.id);
    const onBoth = item => itemIdsOnBoth.includes(item.id);
    return itemsOnFromRoute.filter(onBoth).concat(itemsOnToRoute.filter(onBoth));
  },
  getStyleMapForClones(
    itemsOnFromRoute: Array<*>, 
    itemsOnToRoute: Array<*>, 
    transitionProps) {
    const itemIdsOnBoth = _.intersectionWith(itemsOnFromRoute, itemsOnToRoute, (i1, i2) => i1.id === i2.id)
      .map(item => item.id);
    const createSharedItemStyle = (result, id) => {
      const fromItem = itemsOnFromRoute.find(item => item.id === id);
      const toItem = itemsOnToRoute.find(item => item.id === id);
      console.log('fromItem', fromItem.toString(), 'toItem', toItem.toString());
      const left = {
        outputRange: [fromItem.metrics.x, toItem.metrics.x]
      };
      const top = {
        outputRange: [fromItem.metrics.y, toItem.metrics.y]
      };
      const width = {
        outputRange: [fromItem.metrics.width, toItem.metrics.width]
      };
      const height = {
        outputRange: [fromItem.metrics.height, toItem.metrics.height]
      };
      result[id] = { left, top, width, height, right: null, bottom: null };
      return result;
    };
    return {
      from: itemIdsOnBoth.reduce(createSharedItemStyle, {}),
    }
  },
  canUseNativeDriver() {
    return false;
  }
});

export default SharedElement;