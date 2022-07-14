import React from 'react';

import PreventRemoveContext from './PreventRemoveContext';
import type { EventListenerCallback, EventMapCore } from './types';
import useNavigation from './useNavigation';
import useRoute from './useRoute';

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
  const { key: routeKey } = useRoute();

  const { setPreventRemove } = React.useContext(PreventRemoveContext);

  React.useEffect(() => {
    setPreventRemove?.(routeKey, preventRemove);
    return () => {
      setPreventRemove?.(routeKey, false);
    };
  }, [setPreventRemove, routeKey, preventRemove]);

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
