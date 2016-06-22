/* @flow */

import type { Scene, SceneRendererProps } from './TabViewTypeDefinitions';

type Props = SceneRendererProps & {
  scene: Scene
}

function forStatic(props: Props) {
  const { width, scene, navigationState } = props;
  const { scenes, index } = navigationState;
  const currentIndex = scenes.indexOf(scene);

  const translateX = width * (currentIndex - index);

  return {
    width,
    transform: [ { translateX } ]
  };
}

function forSwipe(props: Props) {
  const { width, position, scene, navigationState } = props;
  const { scenes } = navigationState;
  const currentIndex = scenes.indexOf(scene);
  const inputRange = Array.from(new Array(scenes.length)).map((x, i) => i);
  const outputRange = inputRange.map(i => {
    return width * (currentIndex - i);
  });

  const translateX = position.interpolate({
    inputRange,
    outputRange,
  });

  return {
    width,
    transform: [ { translateX } ]
  };
}

export default {
  forStatic,
  forSwipe,
};
