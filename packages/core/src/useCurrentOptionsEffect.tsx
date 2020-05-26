import * as React from 'react';
import { NavigationContainerRef } from './types';

export default function useCurrentOptionsEffect(
  ref: React.RefObject<NavigationContainerRef | null>,
  listener: (value: object | undefined) => void
) {
  const previous = React.useRef<object | undefined>();
  const listenerWrapper = React.useCallback(() => {
    const currentOptions = ref.current?.getCurrentOptions();
    if (currentOptions !== previous.current) {
      previous.current = currentOptions;
      listener(ref.current?.getCurrentOptions());
    }
  }, [listener, ref]);

  React.useEffect(
    () => ref.current?.addUpdateOptionsListener(listenerWrapper),
    [listenerWrapper, ref]
  );
}
