import * as React from 'react';
import { Animated, StyleSheet, Platform } from 'react-native';
import useTheme from '../../../utils/useTheme';

type Props = React.ComponentProps<typeof Animated.Text> & {
  tintColor?: string;
  children?: string;
};

export default function HeaderTitle({ tintColor, style, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.Text
      accessibilityRole="header"
      numberOfLines={1}
      {...rest}
      style={[
        styles.title,
        { color: tintColor === undefined ? colors.text : tintColor },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  title: Platform.select({
    ios: {
      fontSize: 17,
      fontWeight: '600',
    },
    android: {
      fontSize: 20,
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    default: {
      fontSize: 18,
      fontWeight: '500',
    },
  }),
});
