import * as React from 'react';
import { useNavigation, EventArg } from '@react-navigation/core';

type ScrollableView = {
  scrollTo(options: { x?: number; y?: number; animated?: boolean }): void;
};

export default function useScrollToTop(ref: React.RefObject<ScrollableView>) {
  const navigation = useNavigation();

  React.useEffect(
    () =>
      // @ts-ignore
      // We don't wanna import tab types here to avoid extra deps
      // in addition, there are multiple tab implementations
      navigation.addListener('tabPress', (e: EventArg<'tabPress'>) => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (isFocused && !e.defaultPrevented && ref.current) {
            // When user taps on already focused tab, scroll to top
            ref.current.scrollTo({ y: 0 });
          }
        });
      }),
    [navigation, ref]
  );
}
