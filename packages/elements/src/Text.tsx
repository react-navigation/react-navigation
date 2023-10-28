import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Text as NativeText, type TextProps } from 'react-native';

export function Text({ style, ...rest }: TextProps) {
  const { colors, fonts } = useTheme();

  return (
    <NativeText
      {...rest}
      style={[{ color: colors.text }, fonts.regular, style]}
    />
  );
}
