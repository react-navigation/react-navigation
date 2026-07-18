import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

type Props = {
  focused: boolean;
  active: boolean;
  animated: boolean;
  isNextScreenTransparent: boolean;
  detachCurrentScreen: boolean;
  children: React.ReactNode;
};

export type CardA11yWrapperRef = { setInert: (value: boolean) => void };

export const CardA11yWrapper = React.forwardRef(
  (
    {
      focused,
      active,
      animated,
      isNextScreenTransparent,
      detachCurrentScreen,
      children,
    }: Props,
    ref: React.Ref<CardA11yWrapperRef>
  ) => {
    // Manage this in separate component to avoid re-rendering card during gestures
    // Otherwise the gesture animation will be interrupted as state hasn't updated yet
    const [inert, setInert] = React.useState(false);

    React.useImperativeHandle(ref, () => ({ setInert }), []);

    const viewRef = React.useRef<View>(null);

    // On web, `aria-hidden` and `pointerEvents` don't prevent the screen from receiving keyboard focus
    // So the `inert` attribute is needed to make the hidden screen unfocusable
    // React Native Web's `View` doesn't support the `inert` prop, so set it on the DOM element
    React.useEffect(() => {
      if (Platform.OS === 'web' && viewRef.current != null) {
        // On Web, the ref contains a DOM element
        (viewRef.current as unknown as HTMLElement).inert = !focused;
      }
    }, [focused]);

    const isHidden =
      !animated &&
      isNextScreenTransparent === false &&
      detachCurrentScreen !== false &&
      !focused;

    return (
      <View
        ref={viewRef}
        aria-hidden={!focused}
        pointerEvents={(animated ? inert : !focused) ? 'none' : 'box-none'}
        style={[
          StyleSheet.absoluteFill,
          {
            // This is necessary to avoid unfocused larger pages increasing scroll area
            // The issue can be seen on the web when a smaller screen is pushed over a larger one
            overflow: active ? undefined : 'hidden',
            // We use visibility on web
            display: Platform.OS !== 'web' && isHidden ? 'none' : 'flex',
            // Hide unfocused screens when animation isn't enabled
            // This is also necessary for a11y on web
            // @ts-expect-error visibility is only available on web
            visibility: isHidden ? 'hidden' : 'visible',
          },
        ]}
        // Make sure this view is not removed on the new architecture, as it causes focus loss during navigation on Android.
        // This can happen when the view flattening results in different trees - due to `overflow` style changing in a parent.
        collapsable={false}
      >
        {children}
      </View>
    );
  }
);

CardA11yWrapper.displayName = 'CardA11yWrapper';
