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
    position: Animated.Value;
    updateIndex: (index: number) => void;
}
