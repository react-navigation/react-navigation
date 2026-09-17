import * as React from 'react';
import { type LayoutChangeEvent, Platform, View } from 'react-native';
import useLatestCallback from 'use-latest-callback';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

import { getNamedContext } from './getNamedContext';
import { useClientLayoutEffect } from './useClientLayoutEffect';

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

const FrameContext = getNamedContext<FrameContextType | undefined>(
  'FrameContext',
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

  const subscribe = throttle ? context.subscribeThrottled : context.subscribe;

  const value = useSyncExternalStoreWithSelector(
    subscribe,
    context.getCurrent,
    context.getCurrent,
    selector
  );

  // Record the frame at render time to compare in the layout effect.
  const frame = context.getCurrent();

  const [, forceUpdate] = React.useReducer((value: number) => value + 1, 0);

  const subscriptionRef = React.useRef<RemoveListener | null>(null);
  const subscribedBeforeRef = React.useRef(false);

  useClientLayoutEffect(() => {
    // We have empty dependency array, but `Suspense` can replay the layout effect,
    // So we need to explicitly check if we've subscribed before.
    // Subsequent updates are handled by `useSyncExternalStoreWithSelector`.
    // So we don't need to subscribe again.
    if (subscribedBeforeRef.current) {
      return;
    }

    const check = () => {
      const nextFrame = context.getCurrent();

      if (nextFrame !== frame && !Object.is(selector(nextFrame), value)) {
        forceUpdate();
      }
    };

    // The sync external store subscription starts in a passive effect.
    // So if layout was measured, we may not get it here before paint.
    // We use a layout effect to check if it has changed since the last render,
    // and force an update so it reflects the latest frame before the next paint.
    const unsubscribe = subscribe(check);

    subscriptionRef.current = unsubscribe;

    check();

    return unsubscribe;

    // We only need to check for changes on initial render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // We don't need to keep the subscription after passive effects run.
    // At this point, `useSyncExternalStoreWithSelector` has already subscribed.
    subscriptionRef.current?.();
    subscriptionRef.current = null;
    subscribedBeforeRef.current = true;

    return () => {
      // The layout effect should recheck when `Activity` becomes visible.
      // So we clean this up when `Activity` becomes hidden.
      subscribedBeforeRef.current = false;
    };
  }, []);

  return value;
}

type FrameSizeProviderProps = {
  initialFrame: Frame;
  render: (props: {
    ref: React.RefObject<View | null>;
    onLayout: (event: LayoutChangeEvent) => void;
  }) => React.ReactNode;
};

export function FrameSizeProvider({
  initialFrame,
  render,
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

  const viewRef = React.useRef<View>(null);

  useClientLayoutEffect(() => {
    if (Platform.OS === 'web') {
      // We use ResizeObserver on web
      return;
    }

    viewRef.current?.measure((_x, _y, width, height) => {
      // On old architecture, `measure` is async
      // It can also be called before layout is ready with 0 values
      // So we ignore the updates if we already have layout from `onLayout`
      if (frameRef.current.width > 0 && frameRef.current.height > 0) {
        return;
      }

      onChange({ width, height });
    });
  }, [onChange]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    onChange({ width, height });
  };

  return (
    <FrameContext.Provider value={context}>
      {Platform.OS === 'web' ? (
        <FrameSizeListenerWeb onChange={onChange} />
      ) : null}
      {render({ ref: viewRef, onLayout })}
    </FrameContext.Provider>
  );
}

// FIXME: On the Web, `onLayout` doesn't fire on resize
// So we workaround this by using ResizeObserver
function FrameSizeListenerWeb({
  onChange,
}: {
  onChange: (frame: Frame) => void;
}) {
  const elementRef = React.useRef<HTMLDivElement>(null);

  useClientLayoutEffect(() => {
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
