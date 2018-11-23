import React, { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

/**
 * Used across examples as a screen placeholder.
 */

const SampleText = ({ children }: { children?: ReactNode }) => (
  <Text style={styles.sampleText}>{children}</Text>
);

export default SampleText;

const styles = StyleSheet.create({
  sampleText: {
    margin: 14,
  },
});
