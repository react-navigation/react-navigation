import * as React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

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
export default React.forwardRef<CardSheetRef, Props>(function CardSheet(
  { enabled, layout, style, ...rest },
  ref
) {
  const [fill, setFill] = React.useState(false);
  // To avoid triggering a rerender in Card during animation we had to move
  // the state to CardSheet. The `setPointerEvents` is then hoisted back to the Card.
  const [pointerEvents, setPointerEvents] =
    React.useState<ViewProps['pointerEvents']>('auto');

  React.useImperativeHandle(ref, () => {
    return { setPointerEvents };
  });

  React.useEffect(() => {
    if (typeof document === 'undefined' || !document.body) {
      // Only run when DOM is available
      return;
    }

    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    setFill(width === layout.width && height === layout.height);
  }, [layout.height, layout.width]);

  return (
    <View
      {...rest}
      pointerEvents={pointerEvents}
      style={[enabled && fill ? styles.page : styles.card, style]}
    />
  );
});

const styles = StyleSheet.create({
  page: {
    minHeight: '100%',
  },
  card: {
    flex: 1,
    overflow: 'hidden',
  },
});
