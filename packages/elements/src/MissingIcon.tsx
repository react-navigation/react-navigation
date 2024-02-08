import * as React from 'react';
import { type StyleProp, StyleSheet, Text, type TextStyle } from 'react-native';

type Props = {
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
};

export function MissingIcon({ color, size, style }: Props) {
  return <Text style={[styles.icon, { color, fontSize: size }, style]}>⏷</Text>;
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});
