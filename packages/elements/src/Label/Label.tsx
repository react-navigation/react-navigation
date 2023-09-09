import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from 'react-native';

type Props = Omit<TextProps, 'style'> & {
  tintColor?: string;
  children?: string;
  style?: StyleProp<TextStyle>;
};

export function Label({ tintColor, style, ...rest }: Props) {
  const { colors, fonts } = useTheme();

  return (
    <Text
      numberOfLines={1}
      {...rest}
      style={[
        fonts.regular,
        styles.label,
        { color: tintColor === undefined ? colors.text : tintColor },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});
