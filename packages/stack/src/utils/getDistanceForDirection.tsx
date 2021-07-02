import type { GestureDirection, Layout } from '../types';
import getInvertedMultiplier from './getInvertedMultiplier';

export default function getDistanceForDirection(
  layout: Layout,
  gestureDirection: GestureDirection
): number {
  const multiplier = getInvertedMultiplier(gestureDirection);

  switch (gestureDirection) {
    case 'vertical':
    case 'vertical-inverted':
      return layout.height * multiplier;
    case 'horizontal':
    case 'horizontal-inverted':
      return layout.width * multiplier;
  }
}
