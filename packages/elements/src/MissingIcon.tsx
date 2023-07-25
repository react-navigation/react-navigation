import * as React from 'react';
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
} from 'react-native';

type Props = {
  color?: ColorValue;
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
