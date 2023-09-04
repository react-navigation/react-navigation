import { Easing } from 'react-native';

import type { TransitionSpec } from '../types';

export const CrossFadeAnimationSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 1000,
    easing: Easing.ease,
  },
};
