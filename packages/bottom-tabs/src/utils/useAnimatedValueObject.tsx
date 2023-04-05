import type { NavigationRoute, ParamListBase } from '@react-navigation/routers';
import * as React from 'react';
import { Animated } from 'react-native';

export function useAnimatedValueObject(
  routes: NavigationRoute<ParamListBase, string>[]
) {
  const refs = React.useRef<Record<string, Animated.Value>>({});
  const previous = refs.current;
  refs.current = {};

  routes.forEach(({ key }) => {
    refs.current[key] = previous[key] ?? new Animated.Value(0);
  });

  return refs.current;
}
