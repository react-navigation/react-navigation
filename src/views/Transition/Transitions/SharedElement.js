// @flow

import _ from 'lodash';
import ReactNativePropRegistry from 'ReactNativePropRegistry';

import { createTransition } from '../transitionHelpers';
import { TransitionItem } from '../TransitionItems';

// var ReactNativePropRegistry = require('ReactNativePropRegistry');
// if (!ReactNativePropRegistry) throw 'ReactNativePropRegistry not found'

const animateWidthHeight = (fromItem: TransitionItem, toItem: TransitionItem) => {
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
  return { left, top, width, height, right: null, bottom: null };
};

const animateFontSize = (fromItem: TransitionItem, toItem: TransitionItem) => {
  const findLatestFontSize = (style) => {
    if (_.isNumber(style)) {
      const styleObj = ReactNativePropRegistry.getByID(style);
      return styleObj && styleObj.fontSize;
    } else if (_.isArray(style)) {
      for (let i = style.length - 1; i >= 0; i--) {
        const fontSize = findLatestFontSize(style[i]);
        if (_.isNumber(fontSize)) return fontSize;
      }
    } else return undefined;
  }
  const getFontSize = element => {
    const { style } = element.props;
    return findLatestFontSize(style);
  }
  const fromFontSize = getFontSize(fromItem.reactElement);
  const toFontSize = getFontSize(toItem.reactElement);
  return {
    fontSize: {
      outputRange: [fromFontSize, toFontSize],
    },
  };
};

const animateScale = (fromItem: TransitionItem, toItem: TransitionItem) => {
  const toVsFromScaleX = toItem.metrics.width / fromItem.metrics.width;
  const toVsFromScaleY = toItem.metrics.height / fromItem.metrics.height;
  const scaleX = {
    outputRange: [1, toVsFromScaleX]
  };
  const scaleY = {
    outputRange: [1, toVsFromScaleY]
  };
  const left = {
    outputRange: [fromItem.metrics.x, toItem.metrics.x + fromItem.metrics.width / 2 * (toVsFromScaleX - 1)],
  };
  const top = {
    outputRange: [fromItem.metrics.y, toItem.metrics.y + fromItem.metrics.height / 2 * (toVsFromScaleY - 1)],
  };
  return {
    left,
    top,
    scaleX,
    scaleY,
  };
};

const getElementType = (item: TransitionItem) => {
  return item.reactElement.props.componentType;
}

const SharedElement = createTransition({
  getItemsToClone(
    itemsOnFromRoute: Array<TransitionItem>,
    itemsOnToRoute: Array<TransitionItem>) {
    const itemIdsOnBoth = _.intersectionWith(itemsOnFromRoute, itemsOnToRoute, (i1, i2) => i1.id === i2.id)
      .map(item => item.id);
    const onBoth = item => itemIdsOnBoth.includes(item.id);
    return itemsOnFromRoute.filter(onBoth);
  },
  getItemsToMeasure(
    itemsOnFromRoute: Array<TransitionItem>,
    itemsOnToRoute: Array<TransitionItem>) {
    const itemIdsOnBoth = _.intersectionWith(itemsOnFromRoute, itemsOnToRoute, (i1, i2) => i1.id === i2.id)
      .map(item => item.id);
    const onBoth = item => itemIdsOnBoth.includes(item.id);
    return itemsOnFromRoute.filter(onBoth).concat(itemsOnToRoute.filter(onBoth));
  },
  getStyleMapForClones(
    itemsOnFromRoute: Array<TransitionItem>,
    itemsOnToRoute: Array<TransitionItem>) {
    const itemIdsOnBoth = _.intersectionWith(itemsOnFromRoute, itemsOnToRoute, (i1, i2) => i1.id === i2.id)
      .map(item => item.id);

    const createSharedItemStyle = (result, id) => {
      const fromItem = itemsOnFromRoute.find(item => item.id === id);
      const toItem = itemsOnToRoute.find(item => item.id === id);
      // console.log('fromItem', fromItem.toString(), 'toItem', toItem.toString());

      const elementType = getElementType(fromItem);
      let style;
      switch (elementType) {
        case 'Image': style = animateWidthHeight(fromItem, toItem); break;
        case 'Text': style = {
          ...animateWidthHeight(fromItem, toItem),
          ...animateFontSize(fromItem, toItem),
        };
          break;
        default:
          style = animateScale(fromItem, toItem);
      };
      result[id] = style;
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