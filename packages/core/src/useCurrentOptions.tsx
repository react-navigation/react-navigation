import * as React from 'react';
import { useSubscription } from 'use-subscription';
import GlobalNavigationContext from './GlobalNavigationContext';

export default function useCurrentRoute(): object | undefined {
  const { addListener, getCurrentOptions } = React.useContext(
    GlobalNavigationContext
  );

  return useSubscription({
    getCurrentValue: getCurrentOptions,
    subscribe: addListener,
  });
}
