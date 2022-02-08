import React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { Rect } from 'react-native-safe-area-context';

import BottomTabBarHeightCallbackContext from '../utils/BottomTabBarHeightCallbackContext';

export default function useTabBarLayout(dimensions: Rect) {
  const onHeightChange = React.useContext(BottomTabBarHeightCallbackContext);
  const [layout, setLayout] = React.useState({
    height: 0,
    width: dimensions.width,
  });
  const handleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    onHeightChange?.(height);

    setLayout((layout) => {
      if (height === layout.height && width === layout.width) {
        return layout;
      } else {
        return {
          height,
          width,
        };
      }
    });
  };
  return [layout, handleLayout] as const;
}
