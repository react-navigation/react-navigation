import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import * as React from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

import type { NavigationProp } from './types';
import { useNavigation } from './useNavigation';

type Selector<ParamList extends ParamListBase, T> = (
  state: NavigationState<ParamList>
) => T;

/**
 * Hook to get a value from the current navigation state using a selector.
 *
 * @param selector Selector function to get a value from the state.
 */
export function useNavigationState<ParamList extends ParamListBase, T>(
  selector: Selector<ParamList, T>
): T {
  const navigation = useNavigation<NavigationProp<ParamList>>();

  const subscribe = React.useCallback(
    (callback: () => void) => {
      const unsubscribe = navigation.addListener('state', callback);

      return unsubscribe;
    },
    [navigation]
  );

  const value = useSyncExternalStoreWithSelector(
    subscribe,
    navigation.getState,
    navigation.getState,
    selector
  );

  return value;
}
