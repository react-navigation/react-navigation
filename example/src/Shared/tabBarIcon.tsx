import * as React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const tabBarIcon = (name: string) => ({ tintColor }: { tintColor: string }) => (
  <MaterialIcons style={styles.icon} name={name} color={tintColor} size={24} />
);

export default tabBarIcon;

const styles = StyleSheet.create({
  icon: { backgroundColor: 'transparent' },
});
