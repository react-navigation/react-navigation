import { Button as RNButton, StyleSheet, View } from 'react-native';
import React from 'react';

export const Button = props => (
  <View style={styles.margin}>
    <RNButton {...props} />
  </View>
);

const styles = StyleSheet.create({
  margin: {
    margin: 10,
  },
});
