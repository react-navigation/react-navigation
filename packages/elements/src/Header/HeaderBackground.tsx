import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  Platform,
  type StyleProp,
  StyleSheet,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { getBlurBackgroundColor } from '../getBlurBackgroundColor';
import type { HeaderOptions } from '../types';

type Props = Omit<ViewProps, 'style'> & {
  blurEffect?: HeaderOptions['headerBlurEffect'];
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  children?: React.ReactNode;
};

export function HeaderBackground({
  blurEffect,
  style,
  children,
  ...rest
}: Props) {
  const { colors, dark } = useTheme();

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
            ...StyleSheet.absoluteFillObject,
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
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: -1,
              backgroundColor: flattenedStyle.backgroundColor,
            }}
          />
        ) : null;
    }
  } else {
    containerStyle = style;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        },
        Platform.OS === 'ios' && {
          shadowColor: dark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 1)',
        },
        blurStyle,
        containerStyle,
      ]}
      {...rest}
    >
      {blurBackground}
      {colorBackground}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowOpacity: 0.3,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: StyleSheet.hairlineWidth,
        },
      },
      default: {
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    }),
  },
});
