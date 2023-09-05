import type { BottomTabTransitionPreset } from '../types';
import { forCrossFade, forShifting } from './SceneStyleInterpolators';
import { CrossFadeSpec, ShiftingSpec } from './TransitionSpecs';

export const FadeTransition: BottomTabTransitionPreset = {
  transitionSpec: CrossFadeSpec,
  sceneStyleInterpolator: forCrossFade,
};

export const ShiftingTransition: BottomTabTransitionPreset = {
  transitionSpec: ShiftingSpec,
  sceneStyleInterpolator: forShifting,
};
