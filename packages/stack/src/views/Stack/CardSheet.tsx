import * as React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

type Props = ViewProps & {
  enabled: boolean;
  layout: { width: number; height: number };
  children: React.ReactNode;
};

export type CardSheetRef = {
  setPointerEvents: React.Dispatch<ViewProps['pointerEvents']>;
};

// This component will render a page which overflows the screen
// if the container fills the body by comparing the size
// This lets the document.body handle scrolling of the content
// It's necessary for mobile browsers to be able to hide address bar on scroll
export const CardSheet = React.forwardRef<CardSheetRef, Props>(
  function CardSheet({ enabled, layout, style, ...rest }, ref) {
    const [fill, setFill] = React.useState(false);
    // To avoid triggering a rerender in Card during animation we had to move
    // the state to CardSheet. The `setPointerEvents` is then hoisted back to the Card.
    const [pointerEvents, setPointerEvents] =
      React.useState<ViewProps['pointerEvents']>('auto');

    React.useImperativeHandle(ref, () => {
      return { setPointerEvents };
    });

    const workaroundApplied = React.useRef(false);
    React.useEffect(() => {
      if (typeof document === 'undefined' || !document.body) {
        // Only run when DOM is available
        return;
      }

      const width = document.body.clientWidth;
      const height = document.body.clientHeight;

      // Workaround for mobile Chrome, necessary when a navigation happens
      // when the address bar has already collapsed, which resulted in an
      // empty space at the bottom of the page (matching the height of the
      // address bar). To fix this, it's necessary to update the height of
      // the DOM with the current height of the window.
      // See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
      const fillHeight = height === layout.height;
      if (fillHeight) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.body.setAttribute(
          'style',
          `height: calc(var(--vh, 1vh) * 100);`
        );
        workaroundApplied.current = true;
      } else {
        // Revert the workaround if the stack does not occupy the whole
        // height of the page
        if (workaroundApplied.current) {
          document.documentElement.style.removeProperty('--vh');
        }
      }

      setFill(width === layout.width && height === layout.height);
    }, [layout.height, layout.width]);

    return (
      <View
        {...rest}
        pointerEvents={pointerEvents}
        style={[enabled && fill ? styles.page : styles.card, style]}
      />
    );
  }
);

const styles = StyleSheet.create({
  page: {
    minHeight: '100%',
  },
  card: {
    flex: 1,
    overflow: 'hidden',
  },
});
