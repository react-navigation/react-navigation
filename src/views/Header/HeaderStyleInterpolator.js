/* @flow */

import { I18nManager } from 'react-native';

import type {
  NavigationSceneRendererProps,
  NavigationScene,
  AnimatedViewStyleProp,
} from '../../TypeDefinition';

import getSceneIndicesForInterpolationInputRange from '../../utils/getSceneIndicesForInterpolationInputRange';

/**
 * Utility that builds the style for the navigation header.
 *
 * +-------------+-------------+-------------+
 * |             |             |             |
 * |    Left     |   Title     |   Right     |
 * |  Component  |  Component  | Component   |
 * |             |             |             |
 * +-------------+-------------+-------------+
 */

function forLeft(props: NavigationSceneRendererProps): AnimatedViewStyleProp {
  const { position, scene, scenes } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;

  return {
    opacity: position.interpolate({
      inputRange: [
        first,
        first + Math.abs(index - first) / 2,
        index,
        last - Math.abs(last - index) / 2,
        last,
      ],
      outputRange: ([0, 0, 1, 0, 0]: Array<number>),
    }),
  };
}

function forCenter(props: NavigationSceneRendererProps): AnimatedViewStyleProp {
  const { position, scene } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const inputRange = [first, index, last];

  return {
    opacity: position.interpolate({
      inputRange,
      outputRange: ([0, 1, 0]: Array<number>),
    }),
    transform: [
      {
        translateX: position.interpolate({
          inputRange,
          outputRange: I18nManager.isRTL
            ? ([-200, 0, 200]: Array<number>)
            : ([200, 0, -200]: Array<number>),
        }),
      },
    ],
  };
}

function forRight(props: NavigationSceneRendererProps): AnimatedViewStyleProp {
  const { position, scene } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };
  const { first, last } = interpolate;
  const index = scene.index;

  return {
    opacity: position.interpolate({
      inputRange: [first, index, last],
      outputRange: ([0, 1, 0]: Array<number>),
    }),
  };
}

export default {
  forLeft,
  forCenter,
  forRight,
};
