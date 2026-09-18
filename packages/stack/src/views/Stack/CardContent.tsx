import * as React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

type Props = ViewProps & {
  enabled: boolean;
  layout: { width: number; height: number };
  children: React.ReactNode;
};

export function CardContent({ enabled, layout, style, ...rest }: Props) {
  // If the container fills the body, we consider it to be a "page" that can overflow the screen
  // So we adjust the style accordingly to let the content take more space if needed
  // This lets the document.body handle scrolling of the content
  // This is necessary for mobile browsers to be able to hide the address bar on scroll
  const [fill, setFill] = React.useState(false);

  React.useLayoutEffect(() => {
    if (typeof document === 'undefined' || !document.body) {
      // Only run when DOM is available
      return;
    }

    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    // `document.body.clientHeight`/`clientWidth` are always rounded integers,
    // But `layout` is sub-pixel precise, so we allow a small difference.
    const approximatelyEqual = (a: number, b: number) => Math.abs(a - b) < 1;

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-layout-effect
    setFill(
      approximatelyEqual(width, layout.width) &&
        approximatelyEqual(height, layout.height)
    );
  }, [layout.height, layout.width]);

  return (
    <View
      {...rest}
      style={[
        { pointerEvents: 'box-none' },
        enabled && fill ? styles.page : styles.card,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  page: {
    minHeight: '100%',
  },
  card: {
    flex: 1,
    overflow: 'hidden',
  },
});
