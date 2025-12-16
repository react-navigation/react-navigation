import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  Platform,
  type StyleProp,
  StyleSheet,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { BlurEffectBackground } from '../BlurEffectBackground';
import { type BlurEffectType } from '../getBlurBackgroundColor';

type Props = Omit<ViewProps, 'style'> & {
  blurEffect?: BlurEffectType | 'none';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export function HeaderBackground({
  blurEffect,
  style,
  children,
  ...rest
}: Props) {
  const { colors } = useTheme();

  return (
    <BlurEffectBackground
      blurEffect={blurEffect}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </BlurEffectBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      default: {
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    }),
  },
});
