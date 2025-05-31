import type {
  ParamListBase,
  StackNavigationState,
} from '@react-navigation/native';
import * as React from 'react';

/**
 * In react-native-screens, when a screen is re-arranged, it becomes buggy
 * So we need to detect when a screen was re-arranged and provide a new key
 * This way new screen will be added instead of resulting in buggy state
 *
 * https://github.com/software-mansion/react-native-screens/issues/2575
 */
export function useRouteKeyMappings(
  state: StackNavigationState<ParamListBase>
): Record<string, number> {
  const [keyMappings, setKeyMappings] = React.useState<Record<string, number>>(
    {}
  );

  const [previousState, setPreviousState] = React.useState(state);

  if (state === previousState) {
    return keyMappings;
  }

  setPreviousState(state);

  const focusedRouteKey = state.routes[state.index]?.key;
  const previousFocusedRouteKey =
    previousState.routes[previousState.index]?.key;

  if (focusedRouteKey === previousFocusedRouteKey) {
    return keyMappings;
  }

  const previousIndex = previousState.routes.findLastIndex(
    (route) => route.key === focusedRouteKey
  );

  if (previousIndex === -1) {
    return keyMappings;
  }

  const precedingRouteKey = previousState.routes[previousIndex + 1]?.key;

  // The new focused route is different from the last focused route
  // The route already existed in the previous state
  // The previously preceding route is still in the state
  // So the screen was re-arranged
  if (
    precedingRouteKey &&
    state.routes.some((route) => route.key === precedingRouteKey)
  ) {
    const currentRouteKeys = state.routes.map((route) => route.key);
    const newKeyMappings: Record<string, number> = {};

    // Only keep the mappings for routes present in the current state
    for (const key in keyMappings) {
      if (currentRouteKeys.includes(key)) {
        newKeyMappings[key] = keyMappings[key];
      }
    }

    // Add or increment the mapping for the focused route
    // So we can use a new key to force a remount
    newKeyMappings[focusedRouteKey] =
      newKeyMappings[focusedRouteKey] != null
        ? newKeyMappings[focusedRouteKey]++
        : 0;

    setKeyMappings(newKeyMappings);

    return newKeyMappings;
  }

  return keyMappings;
}
