import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import DrawerItemList from './DrawerItemList';
import { DrawerContentComponentProps } from '../types';

export default function DrawerContent({
  contentContainerStyle,
  style,
  drawerPosition,
  ...rest
}: DrawerContentComponentProps) {
  const insets = useSafeArea();

  return (
    <ScrollView
      contentContainerStyle={[
        {
          paddingTop: insets.top + 4,
          paddingLeft: drawerPosition === 'left' ? insets.left : 0,
          paddingRight: drawerPosition === 'right' ? insets.right : 0,
        },
        contentContainerStyle,
      ]}
      style={[styles.container, style]}
    >
      <DrawerItemList {...rest} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
