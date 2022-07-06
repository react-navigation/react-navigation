import React from 'react';

import NavigationContext from './NavigationContext';
import PreventRemoveContext from './PreventRemoveContext';
import type { EventListenerCallback, EventMapCore } from './types';

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
  const navigation = React.useContext(NavigationContext);
  const state = navigation?.getState();

  const [initialKey] = React.useState(state?.routes[state.index].key);
  const { setPrevented } = React.useContext(PreventRemoveContext);

  const currentKey = state?.routes[state.index].key;

  React.useEffect(() => {
    setPrevented?.(preventRemove && initialKey === currentKey);
  }, [setPrevented, preventRemove, currentKey, initialKey]);

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
