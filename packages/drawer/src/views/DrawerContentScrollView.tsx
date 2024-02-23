import { useLocale } from '@react-navigation/native';
import * as React from 'react';
import { ScrollView, type ScrollViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DrawerPositionContext } from '../utils/DrawerPositionContext';

type Props = ScrollViewProps & {
  children: React.ReactNode;
};

function DrawerContentScrollViewInner(
  { contentContainerStyle, style, children, ...rest }: Props,
  ref?: React.Ref<ScrollView>
) {
  const drawerPosition = React.useContext(DrawerPositionContext);
  const insets = useSafeAreaInsets();
  const { direction } = useLocale();

  const isRight =
    direction === 'rtl'
      ? drawerPosition === 'left'
      : drawerPosition === 'right';

  return (
    <ScrollView
      {...rest}
      ref={ref}
      contentContainerStyle={[
        {
          paddingTop: insets.top + 4,
          paddingStart: !isRight ? insets.left : 0,
          paddingEnd: isRight ? insets.right : 0,
        },
        contentContainerStyle,
      ]}
      style={[styles.container, style]}
    >
      {children}
    </ScrollView>
  );
}

export const DrawerContentScrollView = React.forwardRef(
  DrawerContentScrollViewInner
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
