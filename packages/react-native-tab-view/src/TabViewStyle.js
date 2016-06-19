/* @flow */

import type { SceneRendererProps } from './TabViewTypes';

function forStatic(props: SceneRendererProps) {
  const { width } = props;
  const { index, scenes } = props.navigationState;

  const translateX = width * index * -1;

  return {
    width: width * scenes.length,
    transform: [ { translateX } ]
  };
}

function forSwipe(props: SceneRendererProps) {
  const { width, position } = props;
  const { scenes } = props.navigationState;

  return {
    width: width * scenes.length,
    transform: [ { translateX: position } ]
  };
}

export default {
  forStatic,
  forSwipe,
};
