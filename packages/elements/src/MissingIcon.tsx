import * as React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

type Props = {
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
};

export default function MissingIcon({ color, size, style }: Props) {
  return <Text style={[styles.icon, { color, fontSize: size }, style]}>⏷</Text>;
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});
