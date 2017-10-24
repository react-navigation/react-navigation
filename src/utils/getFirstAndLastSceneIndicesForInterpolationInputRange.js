/* @flow */
/* eslint-disable */

import type {
  NavigationSceneRendererProps,
  NavigationScene,
  SceneIndicesForInterpolationInputRange,
} from '../TypeDefinition';

function getFirstAndLastSceneIndicesForInterpolationInputRange(
  props: NavigationSceneRendererProps
): SceneIndicesForInterpolationInputRange | null {
  const { scene, scenes } = props;
  const index = scene.index;
  const lastSceneIndicesInQueue = scenes.length - 1
  const isBack = !scenes[lastSceneIndicesInQueue].isActive

  if (isBack) {
    const currentSceneIndicesInQueue = scenes.findIndex((item: NavigationScene) => item === scene);
    const activeSceneIndicesInQueue = scenes.findIndex((item: NavigationScene) => item.isActive);
    const activeSceneIndex = scenes[activeSceneIndicesInQueue].index;
    const lastSceneIndex = scenes[lastSceneIndicesInQueue].index;

    if (index !== activeSceneIndex && currentSceneIndicesInQueue === lastSceneIndicesInQueue) {
      return { first: Math.min(activeSceneIndex, index - 1), last: index + 1 };
    } else if (index === activeSceneIndex && currentSceneIndicesInQueue === activeSceneIndicesInQueue) {
      return { first: index - 1, last: Math.max(lastSceneIndex, index + 1) };
    } else if (index === activeSceneIndex || currentSceneIndicesInQueue > activeSceneIndicesInQueue) {
      return null;
    } else {
      return { first: index - 1, last: index + 1 };
    }
  } else {
    return { first: index - 1, last: index + 1 };
  }
}

export default getFirstAndLastSceneIndicesForInterpolationInputRange;
