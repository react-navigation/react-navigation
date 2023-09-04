import type { BottomTabTransitionPreset } from '../types';
import { forCrossFade } from './SceneStyleInterpolators';
import { CrossFadeAnimationSpec } from './TransitionSpecs';

export const FadeTransition: BottomTabTransitionPreset = {
  animationEnabled: true,
  transitionSpec: CrossFadeAnimationSpec,
  sceneStyleInterpolator: forCrossFade,
};
