import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NativeStack() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Not supported on Web :(</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eceff1',
  },
  text: {
    fontSize: 16,
    color: '#999',
  },
});
