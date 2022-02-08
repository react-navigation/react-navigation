import type {
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import {
  Animated,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

import type { BottomTabDescriptorMap } from '../types';
import getPaddingBottom from './getPaddingBottom';
import shouldUseHorizontalLabels from './shouldUseHorizontalLabels';

const DEFAULT_TABBAR_HEIGHT = 49;
const COMPACT_TABBAR_HEIGHT = 32;

export type GetTabHarHeightOptions = {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  layout: { height: number; width: number };
  dimensions: { height: number; width: number };
  insets: EdgeInsets;
  style: Animated.WithAnimatedValue<StyleProp<ViewStyle>> | undefined;
};

export default function getTabBarHeight({
  state,
  descriptors,
  dimensions,
  insets,
  style,
  ...rest
}: GetTabHarHeightOptions) {
  // @ts-ignore
  const customHeight = StyleSheet.flatten(style)?.height;

  if (typeof customHeight === 'number') {
    return customHeight;
  }

  const isLandscape = dimensions.width > dimensions.height;
  const horizontalLabels = shouldUseHorizontalLabels({
    state,
    descriptors,
    dimensions,
    ...rest,
  });
  const paddingBottom = getPaddingBottom(insets);

  if (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    isLandscape &&
    horizontalLabels
  ) {
    return COMPACT_TABBAR_HEIGHT + paddingBottom;
  }

  return DEFAULT_TABBAR_HEIGHT + paddingBottom;
}
