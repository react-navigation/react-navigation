import * as React from 'react';
import { useSubscription } from 'use-subscription';
import useNavigation from './useNavigation';

/**
 * Hook to get the current focus state of the screen. Returns a `true` if screen is focused, otherwise `false`.
 * This can be used if a component needs to render something based on the focus state.
 * It uses `use-subscription` under the hood for safer use in concurrent mode.
 */
export default function useIsFocused(): boolean {
  const navigation = useNavigation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCurrentValue = React.useCallback(navigation.isFocused, [navigation]);
  const subscribe = React.useCallback(
    (callback: (value: boolean) => void) => {
      const unsubscribeFocus = navigation.addListener('focus', () =>
        callback(true)
      );

      const unsubscribeBlur = navigation.addListener('blur', () =>
        callback(false)
      );

      return () => {
        unsubscribeFocus();
        unsubscribeBlur();
      };
    },
    [navigation]
  );

  return useSubscription({
    getCurrentValue,
    subscribe,
  });
}
