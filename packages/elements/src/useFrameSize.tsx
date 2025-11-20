import * as React from 'react';
import {
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import {
  // eslint-disable-next-line no-restricted-imports
  useSafeAreaFrame,
} from 'react-native-safe-area-context';
import useLatestCallback from 'use-latest-callback';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

// Load with require to avoid error from webpack due to missing export in older versions
// eslint-disable-next-line import-x/no-commonjs
const SafeAreaListener = require('react-native-safe-area-context')
  .SafeAreaListener as
  | typeof import('react-native-safe-area-context').SafeAreaListener
  | undefined;

type Frame = {
  width: number;
  height: number;
};

type Listener = () => void;

type RemoveListener = () => void;

type FrameContextType = {
  getCurrent: () => Frame;
  subscribe: (listener: Listener) => RemoveListener;
  subscribeThrottled: (listener: Listener) => RemoveListener;
};

const FrameContext = React.createContext<FrameContextType | undefined>(
  undefined
);

export function useFrameSize<T>(
  selector: (frame: Frame) => T,
  throttle?: boolean
): T {
  const context = React.useContext(FrameContext);

  if (context == null) {
    throw new Error('useFrameSize must be used within a FrameSizeProvider');
  }

  const value = useSyncExternalStoreWithSelector(
    throttle ? context.subscribeThrottled : context.subscribe,
    context.getCurrent,
    context.getCurrent,
    selector
  );

  return value;
}

type FrameSizeProviderProps = {
  initialFrame: Frame;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function FrameSizeProvider({
  initialFrame,
  children,
}: FrameSizeProviderProps) {
  const context = React.useContext(FrameContext);

  if (context != null) {
    // If the context is already present, don't wrap again
    return children;
  }

  return (
    <FrameSizeProviderInner initialFrame={initialFrame}>
      {children}
    </FrameSizeProviderInner>
  );
}

function FrameSizeProviderInner({
  initialFrame,
  children,
}: FrameSizeProviderProps) {
  const frameRef = React.useRef<Frame>({
    width: initialFrame.width,
    height: initialFrame.height,
  });

  const listeners = React.useRef<Set<Listener>>(new Set());

  const getCurrent = useLatestCallback(() => frameRef.current);

  const subscribe = useLatestCallback((listener: Listener): RemoveListener => {
    listeners.current.add(listener);

    return () => {
      listeners.current.delete(listener);
    };
  });

  const subscribeThrottled = useLatestCallback(
    (listener: Listener): RemoveListener => {
      const delay = 100; // Throttle delay in milliseconds

      let timer: ReturnType<typeof setTimeout>;
      let updated = false;
      let waiting = false;

      const throttledListener = () => {
        clearTimeout(timer);

        updated = true;

        if (waiting) {
          // Schedule a timer to call the listener at the end
          timer = setTimeout(() => {
            if (updated) {
              updated = false;
              listener();
            }
          }, delay);
        } else {
          waiting = true;
          setTimeout(function () {
            waiting = false;
          }, delay);

          // Call the listener immediately at start
          updated = false;
          listener();
        }
      };

      const unsubscribe = subscribe(throttledListener);

      return () => {
        unsubscribe();
        clearTimeout(timer);
      };
    }
  );

  const context = React.useMemo<FrameContextType>(
    () => ({
      getCurrent,
      subscribe,
      subscribeThrottled,
    }),
    [subscribe, subscribeThrottled, getCurrent]
  );

  const onChange = useLatestCallback((frame: Frame) => {
    if (
      frameRef.current.height === frame.height &&
      frameRef.current.width === frame.width
    ) {
      return;
    }

    frameRef.current = { width: frame.width, height: frame.height };
    listeners.current.forEach((listener) => listener());
  });

  return (
    <>
      <FrameContext.Provider value={context}>{children}</FrameContext.Provider>
      {/**
       * The frame size listener must come after the content
       * This makes sure that any nested navigator is in the first descendant chain
       * This heuristic is used by react-native-screens to find nested navigators
       */}
      {Platform.OS === 'web' ? (
        <FrameSizeListenerWeb onChange={onChange} />
      ) : typeof SafeAreaListener === 'undefined' ? (
        <FrameSizeListenerNativeFallback onChange={onChange} />
      ) : (
        /**
         * Passing `pointerEvents="none"` to `SafeAreaListener` doesn't work
         * So we wrap it in a `View` and disable pointer events on it
         */
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <SafeAreaListener
            onChange={({ frame }) => onChange(frame)}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
    </>
  );
}

// SafeAreaListener is available only on newer versions
// Fallback to an effect-based shim for older versions
function FrameSizeListenerNativeFallback({
  onChange,
}: {
  onChange: (frame: Frame) => void;
}) {
  const frame = useSafeAreaFrame();

  React.useLayoutEffect(() => {
    onChange(frame);
  }, [frame, onChange]);

  return null;
}

// FIXME: On the Web, the safe area frame value doesn't update on resize
// So we workaround this by measuring the frame on resize
function FrameSizeListenerWeb({
  onChange,
}: {
  onChange: (frame: Frame) => void;
}) {
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (elementRef.current == null) {
      return;
    }

    const rect = elementRef.current.getBoundingClientRect();

    onChange({
      width: rect.width,
      height: rect.height,
    });

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry) {
        const { width, height } = entry.contentRect;

        onChange({ width, height });
      }
    });

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onChange]);

  return (
    <div
      ref={elementRef}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
      }}
    />
  );
}
