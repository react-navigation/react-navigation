import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export function Divider() {
  const { colors } = useTheme();

  return (
    <View style={[styles.divider, { borderBottomColor: colors.border }]} />
  );
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
