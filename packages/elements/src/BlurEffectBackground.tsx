import * as React from 'react';
import {
  Animated,
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import {
  type BlurEffectType,
  getBlurBackgroundColor,
} from './getBlurBackgroundColor';

type Props = Omit<ViewProps, 'style'> & {
  blurEffect: BlurEffectType | 'none' | undefined;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/**
 * Component to use as a background to provide apple-style blur effect.
 *
 * Only supported on web. Falls back to a regular `View` on other platforms.
 */
export function BlurEffectBackground({
  blurEffect,
  style,
  children,
  ...rest
}: Props) {
  let containerStyle, blurStyle, blurBackground, colorBackground;

  if (Platform.OS === 'web' && blurEffect && blurEffect !== 'none') {
    const blurBackgroundColor = getBlurBackgroundColor(blurEffect);

    if (blurBackgroundColor) {
      const backdropFilter = `saturate(180%) blur(30px)`;

      blurStyle = {
        // @ts-expect-error backdropFilter is web-only
        backdropFilter,
        webkitBackdropFilter: backdropFilter,
      };

      blurBackground = (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: -1,
            backgroundColor: blurBackgroundColor,
          }}
        />
      );

      const flattenedStyle = StyleSheet.flatten(style) || {};

      containerStyle = [flattenedStyle, { backgroundColor: 'transparent' }];
      colorBackground =
        'backgroundColor' in flattenedStyle &&
        flattenedStyle.backgroundColor !== 'transparent' ? (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                zIndex: -1,
                backgroundColor: flattenedStyle.backgroundColor,
              },
            ]}
          />
        ) : null;
    }
  } else {
    containerStyle = style;
  }

  return (
    <View style={[blurStyle, containerStyle]} {...rest}>
      {blurBackground}
      {colorBackground}
      {children}
    </View>
  );
}
