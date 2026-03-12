import { UNSTABLE_CornerInset, useLocale } from '@react-navigation/native';
import * as React from 'react';
import { ScrollView, type ScrollViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DrawerPositionContext } from '../utils/DrawerPositionContext';

type Props = ScrollViewProps & {
  children: React.ReactNode;
};

const SPACING = 12;

function DrawerContentScrollViewInner(
  { contentContainerStyle, style, children, ...rest }: Props,
  ref?: React.Ref<ScrollView>
) {
  const drawerPosition = React.use(DrawerPositionContext);
  const insets = useSafeAreaInsets();
  const { direction } = useLocale();

  const isRight =
    direction === 'rtl'
      ? drawerPosition === 'left'
      : drawerPosition === 'right';

  return (
    <>
      <ScrollView
        {...rest}
        ref={ref}
        contentContainerStyle={[
          {
            paddingBottom: SPACING + insets.bottom,
            paddingStart: SPACING + (!isRight ? insets.left : 0),
            paddingEnd: SPACING + (isRight ? insets.right : 0),
          },
          contentContainerStyle,
        ]}
        style={[styles.container, style]}
      >
        <UNSTABLE_CornerInset
          direction="vertical"
          edge="top"
          style={{
            // We don't want to apply both safe area and corner insets
            minHeight: insets.top,
            marginBottom: SPACING,
          }}
        />
        {children}
      </ScrollView>
    </>
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
