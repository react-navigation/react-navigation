import * as React from 'react';
import {
  Dimensions,
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import {
  initialWindowMetrics,
  type Metrics,
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const { width = 0, height = 0 } = Dimensions.get('window');

// To support SSR on web, we need to have empty insets for initial values
// Otherwise there can be mismatch between SSR and client output
// We also need to specify empty values to support tests environments
const initialMetrics =
  Platform.OS === 'web' || initialWindowMetrics == null
    ? {
        frame: { x: 0, y: 0, width, height },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }
    : initialWindowMetrics;

export function SafeAreaProviderCompat({ children, style }: Props) {
  const insets = React.useContext(SafeAreaInsetsContext);

  if (insets) {
    // If we already have insets, don't wrap the stack in another safe area provider
    // This avoids an issue with updates at the cost of potentially incorrect values
    // https://github.com/react-navigation/react-navigation/issues/174
    return <View style={[styles.container, style]}>{children}</View>;
  }

  if (Platform.OS === 'web') {
    children = (
      <SafeAreaFrameProvider initialMetrics={initialMetrics}>
        {children}
      </SafeAreaFrameProvider>
    );
  }

  return (
    <SafeAreaProvider initialMetrics={initialMetrics} style={style}>
      {children}
    </SafeAreaProvider>
  );
}

// FIXME: On the Web, the safe area frame value doesn't update on resize
// So we workaround this by measuring the frame on resize
const SafeAreaFrameProvider = ({
  initialMetrics,
  children,
}: {
  initialMetrics: Metrics;
  children: React.ReactNode;
}) => {
  const element = React.useRef<HTMLDivElement>(null);
  const [frame, setFrame] = React.useState(initialMetrics.frame);

  React.useEffect(() => {
    if (element.current == null) {
      return;
    }

    const rect = element.current.getBoundingClientRect();

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setFrame({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    });

    let timeout: ReturnType<typeof setTimeout>;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry) {
        const { x, y, width, height } = entry.contentRect;

        // Debounce the frame updates to avoid too many updates in a short time
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setFrame({ x, y, width, height });
        }, 100);
      }
    });

    observer.observe(element.current);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <SafeAreaFrameContext.Provider value={frame}>
      <div
        ref={element}
        style={{
          ...StyleSheet.absoluteFillObject,
          pointerEvents: 'none',
          visibility: 'hidden',
        }}
      />
      {children}
    </SafeAreaFrameContext.Provider>
  );
};

SafeAreaProviderCompat.initialMetrics = initialMetrics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
