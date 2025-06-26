import { Image, processColor } from 'react-native';

import type {
  HeaderBarButtonItem,
  HeaderBarButtonItemWithMenu,
} from '../types';

const prepareMenu = (
  menu: HeaderBarButtonItemWithMenu['menu'],
  index: number,
  routeKey: string
): any => {
  return {
    ...menu,
    items: menu.items.map((menuItem, menuIndex) => {
      if ('items' in menuItem) {
        return prepareMenu(menuItem, menuIndex, routeKey);
      }
      return {
        ...menuItem,
        menuId: `${menuItem.title ?? menuItem.systemImage}-${menuIndex}-${index}-${routeKey}`,
      };
    }),
  };
};

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
        menu: prepareMenu(item.menu, index, routeKey),
      };
    }
    return item;
  });
};
