import { NavigationContainerRefContext } from '@react-navigation/core';
import * as React from 'react';
import { Dimensions } from 'react-native';

// eslint-disable-next-line import-x/extensions
import type { CornerInsetProps, CornerInsetRef } from './CornerInset.tsx';
import ReactNavigationCornerInsetViewNativeComponent, {
  Commands,
} from './ReactNavigationCornerInsetViewNativeComponent';

function CornerInsetIOS(
  props: CornerInsetProps,
  ref: React.Ref<CornerInsetRef>
) {
  const root = React.use(NavigationContainerRefContext);

  const nativeRef =
    React.useRef<
      React.ElementRef<typeof ReactNavigationCornerInsetViewNativeComponent>
    >(null);

  const relayout = React.useCallback(() => {
    if (nativeRef.current) {
      Commands.relayout(nativeRef.current);
    }
  }, []);

  React.useEffect(() => {
    if (root == null) {
      return;
    }

    let animationFrameHandle: number | null = null;

    // We freeze the corner insets after initial measurements
    // This is to avoid the insets getting out of sync during transitions
    // We trigger a relayout explicitly on window resize and transition end
    const unsubscribeWindowResize = Dimensions.addEventListener(
      'change',
      () => {
        if (animationFrameHandle) {
          cancelAnimationFrame(animationFrameHandle);
        }

        // When window is unmaximized, calling relayout immediately doesn't work
        // So we delay it to the next frame as a workaround
        animationFrameHandle = requestAnimationFrame(() => {
          relayout();
        });
      }
    );

    const unsubscribeTransition = root.addListener('__unsafe_event__', (e) => {
      if (e.data.type === 'transitionEnd') {
        relayout();
      }
    });

    return () => {
      if (animationFrameHandle) {
        cancelAnimationFrame(animationFrameHandle);
      }

      unsubscribeWindowResize.remove();
      unsubscribeTransition();
    };
  }, [root, relayout]);

  React.useImperativeHandle(
    ref,
    () => ({
      relayout,
    }),
    [relayout]
  );

  return (
    <ReactNavigationCornerInsetViewNativeComponent {...props} ref={nativeRef} />
  );
}

export const CornerInset = React.forwardRef(CornerInsetIOS);
