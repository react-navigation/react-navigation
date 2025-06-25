import { Image, processColor } from 'react-native';

import type { HeaderBarButtonItem } from '../types';

export const prepareHeaderBarButtonItems = (
  barButtonItems: HeaderBarButtonItem[],
  routeKey: string
) => {
  return barButtonItems?.map((item, index) => {
    if ('onPress' in item) {
      return {
        ...item,
        ...(item.image ? { image: Image.resolveAssetSource(item.image) } : {}),
        ...(item.tintColor ? { tintColor: processColor(item.tintColor) } : {}),
        buttonId: `${item.title ?? item.image}-${index}-${routeKey}`,
      };
    }
    return item;
  });
};
