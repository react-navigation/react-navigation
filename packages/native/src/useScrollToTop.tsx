import * as React from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import useTabPress from './useTabPress';

type ScrollOptions = { y?: number; animated?: boolean };

type ScrollableView =
  | { scrollToTop(): void }
  | { scrollTo(options: ScrollOptions): void }
  | { scrollToOffset(options: { offset?: number; animated?: boolean }): void }
  | { scrollResponderScrollTo(options: ScrollOptions): void };

type ScrollableWrapper =
  | { getScrollResponder(): React.ReactNode }
  | { getNode(): ScrollableView }
  | ScrollableView;

function getScrollableNode(ref: React.RefObject<ScrollableWrapper>) {
  if (ref.current == null) {
    return null;
  }

  if (
    'scrollToTop' in ref.current ||
    'scrollTo' in ref.current ||
    'scrollToOffset' in ref.current ||
    'scrollResponderScrollTo' in ref.current
  ) {
    // This is already a scrollable node.
    return ref.current;
  } else if ('getScrollResponder' in ref.current) {
    // If the view is a wrapper like FlatList, SectionList etc.
    // We need to use `getScrollResponder` to get access to the scroll responder
    return ref.current.getScrollResponder();
  } else if ('getNode' in ref.current) {
    // When a `ScrollView` is wraped in `Animated.createAnimatedComponent`
    // we need to use `getNode` to get the ref to the actual scrollview.
    // Note that `getNode` is deprecated in newer versions of react-native
    // this is why we check if we already have a scrollable node above.
    return ref.current.getNode();
  } else {
    return ref.current;
  }
}

export default function useScrollToTop(
  ref: React.RefObject<ScrollableWrapper>
) {
  const navigation = useNavigation();
  const route = useRoute();

  useTabPress(({ tabPressEvent, currentNavigation }) => {
    // We should scroll to top only when the screen is focused
    const isFocused = navigation.isFocused();

    // In a nested stack navigator, tab press resets the stack to first screen
    // So we should scroll to top only when we are on first screen
    const isFirst =
      navigation === currentNavigation ||
      navigation.dangerouslyGetState().routes[0].key === route.key;

    const scrollable = getScrollableNode(ref) as ScrollableWrapper;

    if (isFocused && isFirst && scrollable && !tabPressEvent.defaultPrevented) {
      if ('scrollToTop' in scrollable) {
        scrollable.scrollToTop();
      } else if ('scrollTo' in scrollable) {
        scrollable.scrollTo({ y: 0, animated: true });
      } else if ('scrollToOffset' in scrollable) {
        scrollable.scrollToOffset({ offset: 0, animated: true });
      } else if ('scrollResponderScrollTo' in scrollable) {
        scrollable.scrollResponderScrollTo({ y: 0, animated: true });
      }
    }
  });
}
