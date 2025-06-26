import { Image, processColor } from 'react-native';

import type { HeaderBarButtonItem } from '../types';

export const prepareHeaderBarButtonItems = (
  barButtonItems: HeaderBarButtonItem[],
  routeKey: string
) => {
  return barButtonItems?.map((item, index) => {
    if ('spacing' in item) {
      return item;
    }
    const image = item.image ? Image.resolveAssetSource(item.image) : undefined;
    const titleStyle = item.titleStyle
      ? { ...item.titleStyle, color: processColor(item.titleStyle.color) }
      : undefined;
    const tintColor = item.tintColor ? processColor(item.tintColor) : undefined;
    const processedItem = {
      ...item,
      image,
      titleStyle,
      tintColor,
    };
    if ('onPress' in item) {
      return {
        ...processedItem,
        buttonId: `${item.title ?? item.image}-${index}-${routeKey}`,
      };
    }
    if ('menu' in item) {
      return {
        ...processedItem,
        menu: item.menu.map((menuItem, menuIndex) => ({
          ...menuItem,
          // ...(menuItem.image ? { image: Image.resolveAssetSource(menuItem.image) } : {}),
          // ...(menuItem.tintColor ? { tintColor: processColor(menuItem.tintColor) } : {}),
          // buttonId: `${menuItem.title ?? menuItem.image}-${menuIndex}-${routeKey}`,
          menuId: `${menuItem.title}-${menuIndex}-${routeKey}`,
        })),
      };
    }
    return item;
  });
};
