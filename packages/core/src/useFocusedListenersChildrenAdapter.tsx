import type { ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import NavigationBuilderContext, {
  FocusedNavigationCallback,
  FocusedNavigationListener,
} from './NavigationBuilderContext';
import type { NavigationHelpers } from './types';

type Options = {
  navigation: NavigationHelpers<ParamListBase>;
  focusedListeners: Map<
    string | undefined,
    FocusedNavigationListener | undefined
  >;
};

/**
 * Hook for passing focus callback to children
 */
export default function useFocusedListenersChildrenAdapter({
  navigation,
  focusedListeners,
}: Options) {
  const { addKeyedListener } = React.useContext(NavigationBuilderContext);

  let listenerKey = 'undefined';
  const listener = React.useCallback(
    (callback: FocusedNavigationCallback<any>) => {
      if (navigation.isFocused()) {
        const listenerKeys = focusedListeners.keys();
        for (const key of listenerKeys) {
          const listener = focusedListeners.get(key);
          if (listener) {
            const { handled, result } = listener(callback);

            if (handled) {
              listenerKey = key ?? 'undefined';
              return { handled, result };
            }
          }
        }

        return { handled: true, result: callback(navigation) };
      } else {
        return { handled: false, result: null };
      }
    },
    [focusedListeners, navigation]
  );

  React.useEffect(
    () => addKeyedListener?.('focus', listenerKey, listener),
    [addKeyedListener, listenerKey, listener]
  );
}
