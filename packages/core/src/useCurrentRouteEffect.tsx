import * as React from 'react';
import type { Route } from '@react-navigation/routers';
import { NavigationContainerRef } from './types';

export default function useCurrentRouteEffect(
  ref: React.RefObject<NavigationContainerRef>,
  listener: (value: Route<string> | undefined) => void
) {
  const previous = React.useRef<Route<string> | undefined>();
  const listenerWrapper = React.useCallback(() => {
    const currentRoute = ref.current?.getCurrentRoute();
    if (currentRoute !== previous.current) {
      previous.current = currentRoute;
      listener(currentRoute);
    }
  }, [listener, ref]);

  React.useEffect(
    () => ref.current?.addUpdateOptionsListener(listenerWrapper),
    [ref.current, listenerWrapper]
  );
}
