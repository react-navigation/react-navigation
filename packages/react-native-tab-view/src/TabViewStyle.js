/* @flow */

import type { SceneRendererProps } from './TabViewTypes';

function forStatic(props: SceneRendererProps) {
  const { width, offset } = props;
  const { scenes } = props.navigationState;

  return {
    width: width * scenes.length,
    transform: [ { translateX: offset } ]
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
