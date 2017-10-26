/* @flow */

import type {
  NavigationSceneRendererProps,
  NavigationScene,
  SceneIndicesForInterpolationInputRange,
} from '../TypeDefinition';

function getSceneIndicesForInterpolationInputRange(
  props: NavigationSceneRendererProps
): SceneIndicesForInterpolationInputRange | null {
  const { scene, scenes } = props;
  const index = scene.index;
  const lastSceneIndexInScenes = scenes.length - 1;
  const isBack = !scenes[lastSceneIndexInScenes].isActive;

  if (isBack) {
    const currentSceneIndexInScenes = scenes.findIndex(
      (item: NavigationScene) => item === scene
    );
    const targetSceneIndexInScenes = scenes.findIndex(
      (item: NavigationScene) => item.isActive
    );
    const targetSceneIndexValue = scenes[targetSceneIndexInScenes].index;
    const lastSceneIndexValue = scenes[lastSceneIndexInScenes].index;

    if (
      index !== targetSceneIndexValue &&
      currentSceneIndexInScenes === lastSceneIndexInScenes
    ) {
      return {
        first: Math.min(targetSceneIndexValue, index - 1),
        last: index + 1,
      };
    } else if (
      index === targetSceneIndexValue &&
      currentSceneIndexInScenes === targetSceneIndexInScenes
    ) {
      return {
        first: index - 1,
        last: Math.max(lastSceneIndexValue, index + 1),
      };
    } else if (
      index === targetSceneIndexValue ||
      currentSceneIndexInScenes > targetSceneIndexInScenes
    ) {
      return null;
    } else {
      return { first: index - 1, last: index + 1 };
    }
  } else {
    return { first: index - 1, last: index + 1 };
  }
}

export default getSceneIndicesForInterpolationInputRange;
