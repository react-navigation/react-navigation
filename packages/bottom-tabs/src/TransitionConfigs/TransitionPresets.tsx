import type { BottomTabTransitionPreset } from '../types';
import { forFade, forShift } from './SceneStyleInterpolators';
import { CrossFadeSpec, ShiftSpec } from './TransitionSpecs';

export const FadeTransition: BottomTabTransitionPreset = {
  transitionSpec: CrossFadeSpec,
  sceneStyleInterpolator: forFade,
};

export const ShiftTransition: BottomTabTransitionPreset = {
  transitionSpec: ShiftSpec,
  sceneStyleInterpolator: forShift,
};
