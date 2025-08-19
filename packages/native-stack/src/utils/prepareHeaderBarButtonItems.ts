import { Image, processColor } from 'react-native';

import type {
  HeaderBarButtonItem,
  HeaderBarButtonItemWithMenu,
  HeaderLeftReactElement,
  HeaderRightReactElement,
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
  barButtonItems: (
    | HeaderLeftReactElement
    | HeaderRightReactElement
    | HeaderBarButtonItem
  )[],
  routeKey: string
) => {
  return barButtonItems?.map((item, index) => {
    if (typeof item === 'function') {
      return null;
    }
    if ('spacing' in item) {
      return { ...item, index };
    }
    const image = item.image ? Image.resolveAssetSource(item.image) : undefined;

    const titleStyle = item.titleStyle
      ? { ...item.titleStyle, color: processColor(item.titleStyle.color) }
      : undefined;
    const tintColor = item.tintColor ? processColor(item.tintColor) : undefined;
    const badge = item.badge
      ? {
          ...item.badge,
          color: processColor(item.badge.color),
          backgroundColor: processColor(item.badge.backgroundColor),
        }
      : undefined;
    const processedItem = {
      ...item,
      image,
      titleStyle,
      tintColor,
      badge,
      index,
    };
    if ('onPress' in item) {
      return {
        ...processedItem,
        buttonId: `${index}-${routeKey}`,
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
