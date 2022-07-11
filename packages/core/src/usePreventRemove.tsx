import React from 'react';

import type { EventListenerCallback, EventMapCore } from './types';
import useNavigation from './useNavigation';

/**
 * Hook to prevent screen from being removed.
 *
 * @param preventRemove Boolean indicating whether to prevent screen from being removed.
 * @param callback Optional function which is executed when screen was prevented from being removed.
 */
export default function usePreventRemove(
  preventRemove: boolean,
  callback?: EventListenerCallback<EventMapCore<any>, 'beforeRemove'>
) {
  const navigation = useNavigation();

  React.useEffect(() => {
    const shouldPreventRemove = preventRemove && navigation.isFocused();

    navigation.setOptions({ shouldPreventRemove });

    // FIXME: this is wishful, stupid and won't work in real life scenarios.
    // We could iterate through every parent and set this prop on each
    // but I'm not sure if this is the path we want to take.
    const parent = navigation.getParent();
    parent?.setOptions({ shouldPreventRemove });
  }, [navigation, preventRemove]);

  React.useEffect(
    () =>
      navigation?.addListener('beforeRemove', (e) => {
        if (!preventRemove) {
          return;
        }

        e.preventDefault();

        callback?.(e);
      }),
    [preventRemove, navigation, callback]
  );
}
