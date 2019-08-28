import * as React from 'react';
import { useNavigation, EventArg } from '@react-navigation/core';

type ScrollOptions = { y?: number; animated?: boolean };

type ScrollableView =
  | { scrollToTop(): void }
  | { scrollTo(options: ScrollOptions): void }
  | { scrollToOffset(options: ScrollOptions): void }
  | { scrollResponderScrollTo(options: ScrollOptions): void };

type MaybeScrollableWrapperView =
  | ScrollableView
  | { getScrollResponder: () => ScrollableView }
  | { getNode: () => ScrollableView };

function getNodeFromRef(
  ref: React.RefObject<MaybeScrollableWrapperView>
): ScrollableView | null {
  if (ref.current === null) {
    return null;
  }

  // Support weird animated containers and Animated components.
  if ('getScrollResponder' in ref.current) {
    return ref.current.getScrollResponder();
  } else if ('getNode' in ref.current) {
    return ref.current.getNode();
  } else {
    return ref.current;
  }
}

export default function useScrollToTop(
  ref: React.RefObject<MaybeScrollableWrapperView>
) {
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
          const scrollable = getNodeFromRef(ref);

          if (isFocused && !e.defaultPrevented && scrollable) {
            // When user taps on already focused tab, scroll to top
            if ('scrollToTop' in scrollable) {
              scrollable.scrollToTop();
            } else if ('scrollTo' in scrollable) {
              scrollable.scrollTo({ y: 0, animated: true });
            } else if ('scrollToOffset' in scrollable) {
              scrollable.scrollToOffset({ y: 0, animated: true });
            } else if ('scrollResponderScrollTo' in scrollable) {
              scrollable.scrollResponderScrollTo({ y: 0, animated: true });
            }
          }
        });
      }),
    [navigation, ref]
  );
}
