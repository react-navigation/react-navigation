import type { ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import NavigationBuilderContext, {
  FocusedNavigationCallback,
  FocusedNavigationListener,
} from './NavigationBuilderContext';
import type { NavigationHelpers } from './types';

type Options = {
  navigation: NavigationHelpers<ParamListBase>;
  focusedListeners: Map<string, FocusedNavigationListener | undefined>;
  key?: string;
};

/**
 * Hook for passing focus callback to children
 */
export default function useFocusedListenersChildrenAdapter({
  navigation,
  focusedListeners,
  key,
}: Options) {
  const { addKeyedListener } = React.useContext(NavigationBuilderContext);

  const listener = React.useCallback(
    (callback: FocusedNavigationCallback<any>) => {
      if (navigation.isFocused()) {
        for (const listener of focusedListeners.values()) {
          if (listener) {
            const { handled, result } = listener(callback);
            if (handled) {
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
    () => addKeyedListener?.('focus', key ?? 'root', listener),
    [addKeyedListener, listener, key]
  );
}
