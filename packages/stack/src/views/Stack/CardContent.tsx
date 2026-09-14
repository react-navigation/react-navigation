import * as React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

type Props = ViewProps & {
  enabled: boolean;
  layout: { width: number; height: number };
  children: React.ReactNode;
};

// `document.body.clientHeight`/`clientWidth` are always rounded integers,
// but `layout` is sub-pixel precise, so this tolerates a sub-pixel
// difference instead of requiring an exact match.
function approximatelyEqual(a: number, b: number) {
  return Math.abs(a - b) < 1;
}

// This component will render a page which overflows the screen
// if the container fills the body by comparing the size
// This lets the document.body handle scrolling of the content
// It's necessary for mobile browsers to be able to hide address bar on scroll
export function CardContent({ enabled, layout, style, ...rest }: Props) {
  const [fill, setFill] = React.useState(false);

  React.useEffect(() => {
    if (typeof document === 'undefined' || !document.body) {
      // Only run when DOM is available
      return;
    }

    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setFill(
      approximatelyEqual(width, layout.width) &&
        approximatelyEqual(height, layout.height)
    );
  }, [layout.height, layout.width]);

  // Screens can opt out by explicitly setting `flex: 1` in `contentStyle`
  const optedOut = StyleSheet.flatten(style)?.flex === 1;

  return (
    <View
      {...rest}
      style={[
        { pointerEvents: 'box-none' },
        enabled && !optedOut && fill ? styles.page : styles.card,
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
