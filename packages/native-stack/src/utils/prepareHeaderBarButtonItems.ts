import { Image, processColor } from 'react-native';

import type {
  NativeStackHeaderBarButtonItem,
  NativeStackHeaderBarButtonItemWithCustomView,
  NativeStackHeaderBarButtonItemWithMenu,
} from '../types';

const prepareMenu = (
  menu: NativeStackHeaderBarButtonItemWithMenu['menu'],
  index: number,
  routeKey: string,
  side: 'left' | 'right'
): any => {
  return {
    ...menu,
    items: menu.items.map((menuItem, menuIndex) => {
      if ('items' in menuItem) {
        return prepareMenu(menuItem, menuIndex, routeKey, side);
      }
      return {
        ...menuItem,
        menuId: `${menuIndex}-${index}-${routeKey}-${side}`,
      };
    }),
  };
};

export const prepareHeaderBarButtonItems = (
  barButtonItems: (
    | NativeStackHeaderBarButtonItem
    | NativeStackHeaderBarButtonItemWithCustomView<any>
  )[],
  routeKey: string,
  side: 'left' | 'right'
) => {
  return barButtonItems?.map((item, index) => {
    if ('customView' in item) {
      const { hidesSharedBackground } = item;
      return {
        hidesSharedBackground,
        isSubview: true,
        index,
      };
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
        buttonId: `${index}-${routeKey}-${side}`,
      };
    }
    if ('menu' in item) {
      return {
        ...processedItem,
        menu: prepareMenu(item.menu, index, routeKey, side),
      };
    }
    return item;
  });
};
