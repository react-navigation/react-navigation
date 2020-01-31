import * as React from 'react';
import { ScrollView, StyleSheet, ScrollViewProps } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import DrawerPositionContext from '../utils/DrawerPositionContext';

type Props = ScrollViewProps & {
  children: React.ReactNode;
};

export default function DrawerContentScrollView({
  contentContainerStyle,
  style,
  children,
  ...rest
}: Props) {
  const drawerPosition = React.useContext(DrawerPositionContext);
  const insets = useSafeArea();

  return (
    <ScrollView
      {...rest}
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
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
