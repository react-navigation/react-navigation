import { Image } from 'react-native';

import type { HeaderBarButtonItem } from '../types';

export const prepareHeaderBarButtonItems = (
  barButtonItems: HeaderBarButtonItem[]
) => {
  return barButtonItems?.map((item) => {
    return {
      ...item,
      ...(item.image ? { image: Image.resolveAssetSource(item.image) } : {}),
      buttonId: Math.random().toString(36).slice(2, 7),
    };
  });
};
