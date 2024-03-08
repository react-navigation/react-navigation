import type { BottomTabTransitionPreset } from '../types';
import { forFade, forShifting } from './SceneStyleInterpolators';
import { CrossFadeSpec, ShiftingSpec } from './TransitionSpecs';

export const FadeTransition: BottomTabTransitionPreset = {
  transitionSpec: CrossFadeSpec,
  sceneStyleInterpolator: forFade,
};

export const ShiftingTransition: BottomTabTransitionPreset = {
  transitionSpec: ShiftingSpec,
  sceneStyleInterpolator: forShifting,
};
