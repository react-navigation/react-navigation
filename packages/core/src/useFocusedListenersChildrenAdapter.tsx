import type { ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import NavigationBuilderContext, {
  FocusedNavigationCallback,
  FocusedNavigationListener,
} from './NavigationBuilderContext';
import type { NavigationHelpers } from './types';

type Options = {
  key?: string;
  navigation: NavigationHelpers<ParamListBase>;
  focusedListeners: Record<string, FocusedNavigationListener>;
};

/**
 * Hook for passing focus callback to children
 */
export default function useFocusedListenersChildrenAdapter({
  key,
  navigation,
  focusedListeners,
}: Options) {
  const { addListener } = React.useContext(NavigationBuilderContext);

  const listener = React.useCallback(
    (callback: FocusedNavigationCallback<any>) => {
      if (navigation.isFocused()) {
        for (const listener of Object.values(focusedListeners)) {
          const { handled, result } = listener(callback);

          if (handled) {
            return { handled, result };
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
    () => addListener?.('focus', key ?? 'root', listener),
    [addListener, listener, key]
  );
}
