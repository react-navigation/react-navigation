import type { ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import { NavigationBuilderContext } from './NavigationBuilderContext';
import { NavigationRouteContext } from './NavigationProvider';
import type { NavigationHelpers } from './types';

type Options = {
  navigation: NavigationHelpers<ParamListBase>;
};

/**
 * Hook which lets the container access the navigation object of the root navigator.
 * It's used for the navigation object returned by `useNavigation` outside a screen.
 */
export function useOnGetNavigation({ navigation }: Options) {
  const { addKeyedListener } = React.use(NavigationBuilderContext);
  const route = React.use(NavigationRouteContext);

  React.useInsertionEffect(() => {
    // We only register if this is the root navigator
    // i.e. there is no parent route
    if (route != null) {
      return;
    }

    return addKeyedListener?.('getNavigation', 'root', () => navigation);
  }, [addKeyedListener, navigation, route]);
}
