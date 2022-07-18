import { nanoid } from 'nanoid/non-secure';
import React from 'react';
import useLatestCallback from 'use-latest-callback';

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
  const [id] = React.useState(() => nanoid());

  const navigation = useNavigation();
  const { key: routeKey } = useRoute();

  const { setPreventRemove } = React.useContext(PreventRemoveContext);

  React.useEffect(() => {
    setPreventRemove?.(id, routeKey, preventRemove);
    return () => {
      setPreventRemove?.(id, routeKey, false);
    };
  }, [setPreventRemove, id, routeKey, preventRemove]);

  const beforeRemoveListener = useLatestCallback((e: any) => {
    if (!preventRemove) {
      return;
    }

    e.preventDefault();

    callback?.(e);
  });

  React.useEffect(
    () => navigation?.addListener('beforeRemove', beforeRemoveListener),
    [navigation, beforeRemoveListener]
  );
}
