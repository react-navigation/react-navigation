import { StyleSheet, View, Platform } from 'react-native';
import BaseButton from './Button';
import React from 'react';

export const Button = props => (
  <View style={styles.margin}>
    <BaseButton {...props} />
  </View>
);

const styles = StyleSheet.create({
  margin: {
    ...Platform.select({
      android: {
        margin: 10,
      },
    }),
  },
});
