import * as React from 'react';
import NavigationContext from './NavigationContext';
import { NavigationEventEmitter } from './useEventEmitter';
import { NavigationState } from './types';

type Options = {
  state: NavigationState;
  emitter: NavigationEventEmitter;
};

/**
 * Hook to take care of emitting `focus` and `blur` events.
 */
export default function useFocusEvents({ state, emitter }: Options) {
  const { navigation } = React.useContext(NavigationContext);
  const lastFocusedKeyRef = React.useRef<string | undefined>();

  const currentFocusedKey = state.routes[state.index].key;

  // When the parent screen changes its focus state, we also need to change child's focus
  // Coz the child screen can't be focused if the parent screen is out of fcous
  React.useEffect(
    () =>
      navigation &&
      navigation.addListener('focus', () =>
        emitter.emit({ type: 'focus', target: currentFocusedKey })
      ),
    [currentFocusedKey, emitter, navigation]
  );

  React.useEffect(
    () =>
      navigation &&
      navigation.addListener('blur', () =>
        emitter.emit({ type: 'blur', target: currentFocusedKey })
      ),
    [currentFocusedKey, emitter, navigation]
  );

  React.useEffect(() => {
    const lastFocusedKey = lastFocusedKeyRef.current;

    lastFocusedKeyRef.current = currentFocusedKey;

    // We wouldn't have `lastFocusedKey` on initial mount
    // Fire focus event for the current route on mount if there's no parent navigator
    if (lastFocusedKey === undefined && !navigation) {
      emitter.emit({ type: 'focus', target: currentFocusedKey });
    }

    // We should only dispatch events when the focused key changed and navigator is focused
    // When navigator is not focused, screens inside shouldn't receive focused status either
    if (
      lastFocusedKey === currentFocusedKey ||
      !(navigation ? navigation.isFocused() : true)
    ) {
      return;
    }

    state.routes.forEach((route, i) => {
      if (
        lastFocusedKey === undefined ||
        (route.key !== lastFocusedKey && route.key !== currentFocusedKey)
      ) {
        // Only fire events after mount, or if focus state of this route changed
        return;
      }

      emitter.emit({
        type: i === state.index ? 'focus' : 'blur',
        target: route.key,
      });
    });
  }, [currentFocusedKey, emitter, navigation, state.index, state.routes]);
}
