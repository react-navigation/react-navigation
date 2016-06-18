/* @flow */

import { Animated } from 'react-native';

export type Scene = {
  label: string;
  key: string;
}

export type NavigationState = {
  index: number;
  scenes: Array<Scene>;
}

export type SceneRendererProps = {
    width: number;
    navigationState: NavigationState;
    offset: number;
    position: Animated.Value;
    updateIndex: Function;
    updatePosition: Function;
}
