/* @flow */

import {
  Animated,
} from 'react-native';
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

  const translateX = Animated.multiply(position, width * -1);

  return {
    width: width * scenes.length,
    transform: [ { translateX } ]
  };
}

export default {
  forStatic,
  forSwipe,
};
