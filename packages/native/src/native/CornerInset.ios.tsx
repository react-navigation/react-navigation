import { NavigationContainerRefContext } from '@react-navigation/core';
import * as React from 'react';
import { Dimensions } from 'react-native';

// eslint-disable-next-line import-x/extensions
import type { CornerInsetProps, CornerInsetRef } from './CornerInset.tsx';
import ReactNavigationCornerInsetViewNativeComponent, {
  Commands,
} from './ReactNavigationCornerInsetViewNativeComponent';

type Props = CornerInsetProps & {
  ref?: React.Ref<CornerInsetRef> | undefined;
};

export function CornerInset({ ref, ...rest }: Props) {
  const root = React.use(NavigationContainerRefContext);

  const nativeRef =
    React.useRef<
      React.ComponentRef<typeof ReactNavigationCornerInsetViewNativeComponent>
    >(null);

  const relayout = React.useCallback(() => {
    // FIXME:
    // We can only dispatch commands to host components, otherwise we get an error
    // But the ref is a class component if the native component is mocked with React Native's Jest Preset
    if (
      nativeRef.current != null &&
      !(nativeRef.current instanceof React.Component)
    ) {
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
        relayout();

        if (animationFrameHandle) {
          cancelAnimationFrame(animationFrameHandle);
        }

        // When window is unmaximized, calling relayout immediately doesn't work
        // So we delay it to the next frame as a workaround
        animationFrameHandle = requestAnimationFrame(() => {
          animationFrameHandle = requestAnimationFrame(() => {
            relayout();
          });
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
    <ReactNavigationCornerInsetViewNativeComponent {...rest} ref={nativeRef} />
  );
}
