/* @flow */

import { I18nManager, Dimensions } from 'react-native';

import type { NavigationSceneRendererProps } from '../TypeDefinition';

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

function forLeft(props: NavigationSceneRendererProps): Object {
  const { position, scene, scenes, widths } = props;
  const { index } = scene;

  const lastScene = scenes[index - 1];

  const offset = 27;
  let distance = 200;

  if (lastScene && widths[lastScene.key]) {
    const diff = Dimensions.get('window').width - widths[lastScene.key];
    distance = diff / 2 - offset;
  }

  return {
    opacity: position.interpolate({
      inputRange: [index - 1, index - 0.4, index, index + 0.4, index + 1],
      outputRange: ([0, 0, 1, 0, 0]: Array<number>),
    }),
    transform: [
      {
        scaleX: position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [1.15, 1, 1.15],
        }),
      },
      {
        translateX: position.interpolate({
          inputRange: [index - 1, index + 1],
          outputRange: I18nManager.isRTL
            ? ([-distance, distance]: Array<number>)
            : ([distance, -distance]: Array<number>),
        }),
      },
    ],
  };
}

function forCenter(props: NavigationSceneRendererProps): Object {
  const { position, scene, widths } = props;
  const { index, key } = scene;

  const offset = 27;
  let leftDistance = 200;
  let rightDistance = 200;

  if (widths[key]) {
    const diff = Dimensions.get('window').width - widths[key];
    leftDistance = diff / 2 - offset;
    rightDistance = diff - offset;
  }

  return {
    opacity: position.interpolate({
      inputRange: [index - 1, index - 0.75, index, index + 0.75, index + 1],
      outputRange: ([0, 0, 1, 0, 0]: Array<number>),
    }),
    transform: [
      {
        translateX: position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: I18nManager.isRTL
            ? ([-leftDistance, 0, rightDistance]: Array<number>)
            : ([rightDistance, 0, -leftDistance]: Array<number>),
        }),
      },
    ],
  };
}

function forRight(props: NavigationSceneRendererProps): Object {
  const { position, scene } = props;
  const { index } = scene;
  return {
    opacity: position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: ([0, 1, 0]: Array<number>),
    }),
  };
}

export default {
  forLeft,
  forCenter,
  forRight,
};
