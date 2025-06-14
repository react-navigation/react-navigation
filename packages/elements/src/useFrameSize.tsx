import * as React from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
// eslint-disable-next-line no-restricted-imports
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import useLatestCallback from 'use-latest-callback';

type Size = {
  width: number;
  height: number;
};

type Listener = (size: Size) => void;

type RemoveListener = () => void;

type FrameContextType = {
  getCurrent: () => Size;
  subscribe: (listener: Listener, debounce?: boolean) => RemoveListener;
  subscribeDebounced: (listener: Listener) => RemoveListener;
};

const FrameContext = React.createContext<FrameContextType | undefined>(
  undefined
);

export function useFrameSize<T>(
  selector: (size: Size) => T,
  debounce?: boolean
): T {
  const context = React.useContext(FrameContext);

  if (context == null) {
    throw new Error('useFrameSize must be used within a FrameSizeProvider');
  }

  const value = React.useSyncExternalStore(
    debounce ? context.subscribeDebounced : context.subscribe,
    () => selector(context.getCurrent()),
    () => selector(context.getCurrent())
  );

  return value;
}

export function FrameSizeProvider({ children }: { children: React.ReactNode }) {
  const context = React.useContext(FrameContext);

  if (context != null) {
    // If the context is already present, don't wrap again
    return children;
  }

  return <FrameSizeProviderInner>{children}</FrameSizeProviderInner>;
}

function FrameSizeProviderInner({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const listeners = React.useRef<Set<Listener>>(new Set());

  const { element, get } = useResizeListener((size) => {
    listeners.current.forEach((listener) => listener(size));
  });

  const getCurrent = useLatestCallback(get);

  const subscribe = useLatestCallback((listener: Listener): RemoveListener => {
    listeners.current.add(listener);

    return () => {
      listeners.current.delete(listener);
    };
  });

  const subscribeDebounced = useLatestCallback(
    (listener: Listener): RemoveListener => {
      let timer: ReturnType<typeof setTimeout>;

      const debouncedListener = (size: Size) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          listener(size);
        }, 100);
      };

      listeners.current.add(debouncedListener);

      return () => {
        clearTimeout(timer);
        listeners.current.delete(debouncedListener);
      };
    }
  );

  const context = React.useMemo<FrameContextType>(
    () => ({
      getCurrent,
      subscribe,
      subscribeDebounced,
    }),
    [subscribe, subscribeDebounced, getCurrent]
  );

  return (
    <FrameContext.Provider value={context}>
      {element}
      {children}
    </FrameContext.Provider>
  );
}

const useResizeListener =
  Platform.OS === 'web' ? useResizeListenerWeb : useResizeListenerNative;

function useResizeListenerNative(onChange: (size: Size) => void) {
  const frame = useSafeAreaFrame();

  React.useLayoutEffect(() => {
    onChange(frame);
  }, [frame, onChange]);

  return {
    element: null,
    get: () => frame,
  };
}

const { width = 0, height = 0 } = Dimensions.get('window');

// FIXME: On the Web, the safe area frame value doesn't update on resize
// So we workaround this by measuring the frame on resize
function useResizeListenerWeb(onChange: (size: Size) => void) {
  const frameRef = React.useRef<Size>({
    width,
    height,
  });

  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (elementRef.current == null) {
      return;
    }

    const update = (size: Size) => {
      if (
        frameRef.current.width === size.width &&
        frameRef.current.height === size.height
      ) {
        return;
      }

      frameRef.current = size;
      onChange(size);
    };

    const rect = elementRef.current.getBoundingClientRect();

    update({
      width: rect.width,
      height: rect.height,
    });

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry) {
        const { width, height } = entry.contentRect;

        update({ width, height });
      }
    });

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onChange]);

  const element = (
    <div
      ref={elementRef}
      style={{
        ...StyleSheet.absoluteFillObject,
        pointerEvents: 'none',
        visibility: 'hidden',
      }}
    />
  );

  return {
    element,
    get: () => frameRef.current,
  };
}
