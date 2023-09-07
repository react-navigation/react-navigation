import { Easing } from 'react-native';

import type { TransitionSpec } from '../types';

export const CrossFadeSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 150,
    easing: Easing.in(Easing.linear),
  },
};

export const ShiftingSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
  },
};
