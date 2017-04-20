/* @flow */

import { I18nManager } from 'react-native';
import type { SceneRendererProps } from './TabViewTypeDefinitions';

function forHorizontal(props: SceneRendererProps) {
  const { layout, position, navigationState } = props;
  const { width } = layout;
  const { routes } = navigationState;
  // Prepend '-1', so there are always at least 2 items in inputRange
  const inputRange = [ -1, ...routes.map((x, i) => i) ];
  const outputRange = inputRange.map(i =>
    width * i * (I18nManager.isRTL ? 1 : -1)
  );

  const translateX = position.interpolate({
    inputRange,
    outputRange,
  });

  return {
    transform: [ { translateX } ],
  };
}

export default {
  forHorizontal,
};
