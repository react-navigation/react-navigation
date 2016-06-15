/* @flow */

export type Scene = {
  label: string;
  key: string;
}

export type NavigationState = {
  index: number;
  scenes: Array<Scene>;
}
