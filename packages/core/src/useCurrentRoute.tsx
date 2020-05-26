import * as React from 'react';
import { useSubscription } from 'use-subscription';
import GlobalNavigationContext from './GlobalNavigationContext';
import type { Route } from '@react-navigation/routers';

export default function useCurrentRoute(): Route<string> | undefined {
  const { addListener, getCurrentRoute } = React.useContext(
    GlobalNavigationContext
  );

  return useSubscription({
    getCurrentValue: getCurrentRoute,
    subscribe: addListener,
  });
}
