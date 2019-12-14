import * as React from 'react';
import { ScrollView, StyleSheet, ScrollViewProps } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

type Props = ScrollViewProps & {
  drawerPosition: 'left' | 'right';
  children: React.ReactNode;
};

export default function DrawerContentScrollView({
  contentContainerStyle,
  style,
  drawerPosition,
  children,
  ...rest
}: Props) {
  const insets = useSafeArea();
  const { colors } = useTheme();

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
      style={[styles.container, { backgroundColor: colors.card }, style]}
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
