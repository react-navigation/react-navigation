import { Button as RNButton, StyleSheet, View } from 'react-native';
import React from 'react';

export const Button = props => (
  <View style={{ margin: 10 }}>
    <RNButton {...props} />
  </View>
);
