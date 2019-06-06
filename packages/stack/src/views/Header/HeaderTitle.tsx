import * as React from 'react';
import { Text, StyleSheet, Platform, TextProps } from 'react-native';

type Props = TextProps & {
  children: string;
};

export default function HeaderTitle({ style, ...rest }: Props) {
  return <Text {...rest} style={[styles.title, style]} />;
}

const styles = StyleSheet.create({
  title: Platform.select({
    ios: {
      fontSize: 17,
      fontWeight: '600',
      color: 'rgba(0, 0, 0, .9)',
    },
    android: {
      fontSize: 20,
      fontWeight: '500',
      color: 'rgba(0, 0, 0, .9)',
    },
    default: {
      fontSize: 18,
      fontWeight: '400',
      color: '#3c4043',
    },
  }),
});
